import { NotificationType } from "@/domain/entities/notificationEntity";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";
import { IResolveComplaintUseCase } from "@/domain/interface/admin/complaint/IResolveComplaintUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";
import { ComplaintMapper } from "@/application/mapper/user/complaintMapper";

export class ResolveComplaintUseCase implements IResolveComplaintUseCase {
  constructor(
    private complaintRepository: IComplaintRepository,
    private bookingRepository: IBookingRepository,
    private walletRepository: IWalletRepository,
    private sendNotificationUseCase: ISendNotificationUseCase
  ) {}

  async resolveComplaint(complaintId: string, action: "resolve" | "dismiss", adminComment: string): Promise<ComplaintResponseDTO | null> {
    const complaint = await this.complaintRepository.findById(complaintId);
    if (!complaint) throw new Error(MESSAGES.COMPLAINT.NOT_FOUND);
    if (complaint.status !== "pending") throw new Error(MESSAGES.COMPLAINT.ALREADY_PROCESSED);

    const booking = await this.bookingRepository.findById(complaint.bookingId);
    if (!booking) throw new Error(MESSAGES.BOOKING.NOT_FOUND);

    if (action === "resolve") {
      const userId = typeof complaint.userId === 'string' ? complaint.userId : (complaint.userId as unknown as { _id: string })._id;
      
      // Debit Admin Wallet (Full amount refunded to user)
      await this.walletRepository.updateBalance("admin", "admin", -booking.amount, {
        amount: booking.amount,
        type: "debit",
        description: `Refund for booking ${booking.id} - Complaint Resolved`,
        source: "refund",
        sourceId: complaint.bookingId,
        relatedName: "user_refund"
      });

      // Credit User Wallet (100% of the booking amount returned to user)
      await this.walletRepository.updateBalance(userId, "user", booking.amount, {
        amount: booking.amount,
        type: "credit",
        description: `Refund for booking ${booking.id} - Complaint Resolved`,
        source: "refund",
        sourceId: complaint.bookingId,
      });

      complaint.status = "resolved";
      await this.bookingRepository.updatePaymentStatus(complaint.bookingId, "refunded");
    } else {
      const creatorId = typeof complaint.creatorId === 'string' ? complaint.creatorId : (complaint.creatorId as unknown as { _id: string })._id;
      
      const totalAmount = booking.amount;
      const commission = Math.round(totalAmount * 0.2);
      const creatorAmount = totalAmount - commission;

      // 1. Debit Admin Wallet (Only the creator's share, admin retains commission)
      await this.walletRepository.updateBalance("admin", "admin", -creatorAmount, {
        amount: creatorAmount,
        type: "debit",
        description: `Payment release for booking ${booking.id} - Complaint Dismissed (Total: ₹${totalAmount}, Commission: ₹${commission})`,
        source: "booking",
        sourceId: complaint.bookingId,
        relatedName: "creator_payout"
      });

      // 2. Credit Creator Wallet
      await this.walletRepository.updateBalance(creatorId, "creator", creatorAmount, {
        amount: creatorAmount,
        type: "credit",
        description: `Payment for booking ${booking.id} - Complaint Dismissed (After 20% admin commission)`,
        source: "booking",
        sourceId: complaint.bookingId,
      });

      complaint.status = "dismissed";
      await this.bookingRepository.updatePaymentStatus(complaint.bookingId, "released");
    }

    complaint.adminComment = adminComment;
    const updatedComplaint = await this.complaintRepository.update(complaint);

    // Send notifications
    try {
      const userIdStr = typeof complaint.userId === 'string' ? complaint.userId : (complaint.userId as unknown as { _id?: { toString(): string } })._id?.toString();
      if (userIdStr) {
        await this.sendNotificationUseCase.sendNotification({
          recipientId: userIdStr,
          type: NotificationType.REPORT,
          title: action === "resolve" ? "Complaint Resolved - Refund Issued" : "Complaint Update",
          message: action === "resolve" 
            ? `Your complaint for booking ${booking.id || (booking as unknown as { _id: string })._id} has been resolved and a refund of ₹${booking.amount} has been credited to your wallet. Admin feedback: ${adminComment}`
            : `Your complaint for booking ${booking.id || (booking as unknown as { _id: string })._id} has been reviewed. Status: Dismissed. Admin feedback: ${adminComment}`,
          isRead: false,
          metadata: { 
            complaintId: updatedComplaint?._id?.toString(), 
            status: updatedComplaint?.status, 
            bookingId: booking.id || (booking as unknown as { _id?: { toString(): string } })._id?.toString() || (booking as unknown as { id: string }).id 
          }
        });
      }

      const creatorIdStr = typeof complaint.creatorId === 'string' ? complaint.creatorId : (complaint.creatorId as unknown as { _id?: { toString(): string } })._id?.toString();
      if (creatorIdStr) {
        await this.sendNotificationUseCase.sendNotification({
          recipientId: creatorIdStr,
          type: NotificationType.REPORT,
          title: action === "resolve" ? "Complaint Update - Refund Processed" : "Complaint Dismissed - Payment Released",
          message: action === "resolve"
            ? `A complaint for booking ${booking.id || (booking as unknown as { _id: string })._id} was resolved. Payment was refunded to the user.`
            : `A complaint for booking ${booking.id || (booking as unknown as { _id: string })._id} has been dismissed. Payment released to your wallet.`,
          isRead: false,
          metadata: { 
            complaintId: updatedComplaint?._id?.toString(), 
            status: updatedComplaint?.status, 
            bookingId: booking.id || (booking as unknown as { _id?: { toString(): string } })._id?.toString() || (booking as unknown as { id: string }).id 
          }
        });
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }

    return updatedComplaint ? ComplaintMapper.toDto(updatedComplaint) : null;
  }
}

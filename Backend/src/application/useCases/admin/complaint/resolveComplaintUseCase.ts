import { NotificationType } from "@/domain/entities/notificationEntity";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";
import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { IResolveComplaintUseCase } from "@/domain/interface/admin/complaint/IResolveComplaintUseCase";

export class ResolveComplaintUseCase implements IResolveComplaintUseCase {
  constructor(
    private complaintRepository: IComplaintRepository,
    private bookingRepository: IBookingRepository,
    private walletRepository: IWalletRepository,
    private sendNotificationUseCase: ISendNotificationUseCase
  ) {}

  async resolveComplaint(complaintId: string, action: "resolve" | "dismiss", adminComment: string): Promise<ComplaintEntity | null> {
    const complaint = await this.complaintRepository.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");
    if (complaint.status !== "pending") throw new Error("Complaint already processed");

    const booking = await this.bookingRepository.findById(complaint.bookingId);
    if (!booking) throw new Error("Booking not found");

    if (action === "resolve") {
      const userId = typeof complaint.userId === 'string' ? complaint.userId : (complaint.userId as any)._id;
      await this.walletRepository.updateBalance(userId, "user", booking.amount, {
        amount: booking.amount,
        type: "credit",
        description: `Refund for booking ${booking.id} - Complaint Resolved`,
        source: "refund",
        sourceId: complaint.bookingId,
      });
      complaint.status = "resolved";
    } else {
      const creatorId = typeof complaint.creatorId === 'string' ? complaint.creatorId : (complaint.creatorId as any)._id;
      await this.walletRepository.updateBalance(creatorId, "creator", booking.amount, {
        amount: booking.amount,
        type: "credit",
        description: `Payment for booking ${booking.id} - Complaint Dismissed`,
        source: "booking",
        sourceId: complaint.bookingId,
      });
      complaint.status = "dismissed";
    }

    complaint.adminComment = adminComment;
    const updatedComplaint = await this.complaintRepository.update(complaint);

    // Send notification to user
    try {
      const userId = typeof complaint.userId === 'string' ? complaint.userId : (complaint.userId as any)._id?.toString();
      if (userId) {
        await this.sendNotificationUseCase.sendNotification({
          recipientId: userId,
          type: NotificationType.REPORT,
          title: action === "resolve" ? "Complaint Resolved - Refund Issued" : "Complaint Update",
          message: action === "resolve" 
            ? `Your complaint for booking ${booking.id || (booking as any)._id} has been resolved and a refund of ₹${booking.amount} has been credited to your wallet. Admin feedback: ${adminComment}`
            : `Your complaint for booking ${booking.id || (booking as any)._id} has been reviewed. Status: Dismissed. Admin feedback: ${adminComment}`,
          isRead: false,
          metadata: { 
            complaintId: updatedComplaint?._id?.toString(), 
            status: updatedComplaint?.status, 
            bookingId: booking.id || (booking as any)._id?.toString() || (booking as any).id 
          }
        });
      }

      // Also notify creator
      const creatorId = typeof complaint.creatorId === 'string' ? complaint.creatorId : (complaint.creatorId as any)._id?.toString();
      if (creatorId) {
        await this.sendNotificationUseCase.sendNotification({
          recipientId: creatorId,
          type: NotificationType.REPORT,
          title: action === "resolve" ? "Complaint Update - Payment Deduced" : "Complaint Dismissed - Payment Released",
          message: action === "resolve"
            ? `A complaint for booking ${booking.id || (booking as any)._id} was resolved in favor of the user. Payment was refunded. Admin feedback: ${adminComment}`
            : `A complaint for booking ${booking.id || (booking as any)._id} has been dismissed. The payment has been released to your wallet. Admin feedback: ${adminComment}`,
          isRead: false,
          metadata: { 
            complaintId: updatedComplaint?._id?.toString(), 
            status: updatedComplaint?.status, 
            bookingId: booking.id || (booking as any)._id?.toString() || (booking as any).id 
          }
        });
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }

    return updatedComplaint;
  }
}

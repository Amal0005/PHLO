import { NotificationType } from "@/domain/entities/notificationEntity";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";
import { IRejectComplaintUseCase } from "@/domain/interface/admin/complaint/IRejectComplaintUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";
import { ComplaintMapper } from "@/application/mapper/user/complaintMapper";

export class RejectComplaintUseCase implements IRejectComplaintUseCase {
  constructor(
    private complaintRepository: IComplaintRepository,
    private bookingRepository: IBookingRepository,
    private walletRepository: IWalletRepository,
    private sendNotificationUseCase: ISendNotificationUseCase,
  ) {}

  async rejectComplaint(
    complaintId: string,
    adminComment: string,
  ): Promise<ComplaintResponseDTO | null> {
    const complaint = await this.complaintRepository.findById(complaintId);
    if (!complaint) throw new Error(MESSAGES.COMPLAINT.NOT_FOUND);
    if (complaint.status !== "pending")
      throw new Error(MESSAGES.COMPLAINT.ALREADY_PROCESSED);

    const booking = await this.bookingRepository.findById(complaint.bookingId);
    if (!booking) throw new Error(MESSAGES.BOOKING.NOT_FOUND);

    const creatorId =
      typeof complaint.creatorId === "string"
        ? complaint.creatorId
        : (complaint.creatorId as unknown as { _id: string })._id;

    const totalAmount = booking.amount;
    const commission = Math.round(totalAmount * 0.2);
    const creatorAmount = totalAmount - commission;

    await this.walletRepository.updateBalance(
      "admin",
      "admin",
      -creatorAmount,
      {
        amount: creatorAmount,
        type: "debit",
        description: `Payout for booking ${booking.id || (booking as unknown as { id: string }).id} - Complaint Rejected (Total: ₹${totalAmount}, Commission: ₹${commission})`,
        source: "booking",
        sourceId: complaint.bookingId,
        relatedName: "creator_payout",
      },
    );

    await this.walletRepository.updateBalance(
      creatorId,
      "creator",
      creatorAmount,
      {
        amount: creatorAmount,
        type: "credit",
        description: `Payment received for booking ${booking.id || (booking as unknown as { id: string }).id} - Complaint Rejected (After 20% admin commission)`,
        source: "booking",
        sourceId: complaint.bookingId,
      },
    );

    complaint.status = "dismissed";
    complaint.adminComment = adminComment;

    await this.bookingRepository.updatePaymentStatus(
      complaint.bookingId,
      "released",
    );

    const updatedComplaint = await this.complaintRepository.update(complaint);

    try {
      const userId =
        typeof complaint.userId === "string"
          ? complaint.userId
          : (
            complaint.userId as unknown as { _id?: { toString(): string } }
          )._id?.toString();
      if (userId) {
        await this.sendNotificationUseCase.sendNotification({
          recipientId: userId,
          type: NotificationType.REPORT,
          title: "Complaint Update - Rejected",
          message: `Your complaint for booking ${booking.id || (booking as unknown as { id: string }).id} has been reviewed and rejected. Admin feedback: ${adminComment}`,
          isRead: false,
          metadata: {
            complaintId: updatedComplaint?._id?.toString(),
            status: updatedComplaint?.status,
            bookingId:
              booking.id ||
              (booking as unknown as { id: string }).id ||
              (
                booking as unknown as { _id?: { toString(): string } }
              )._id?.toString(),
          },
        });
      }

      const creatorIdStr =
        typeof creatorId === "string"
          ? creatorId
          : (
            creatorId as unknown as { _id?: { toString(): string } }
          )._id?.toString();
      if (creatorIdStr) {
        await this.sendNotificationUseCase.sendNotification({
          recipientId: creatorIdStr,
          type: NotificationType.REPORT,
          title: "Complaint Update - Dismissed",
          message: `A complaint for booking ${booking.id || (booking as unknown as { id: string }).id} has been dismissed in your favor. Payment released. Admin feedback: ${adminComment}`,
          isRead: false,
          metadata: {
            complaintId: updatedComplaint?._id?.toString(),
            status: updatedComplaint?.status,
            bookingId:
              booking.id ||
              (booking as unknown as { id: string }).id ||
              (
                booking as unknown as { _id?: { toString(): string } }
              )._id?.toString(),
          },
        });
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }

    return updatedComplaint ? ComplaintMapper.toDto(updatedComplaint) : null;
  }
}

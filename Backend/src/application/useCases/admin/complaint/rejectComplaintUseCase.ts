import { NotificationType } from "@/domain/entities/notificationEntity";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";
import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { IRejectComplaintUseCase } from "@/domain/interface/admin/complaint/IRejectComplaintUseCase";

export class RejectComplaintUseCase implements IRejectComplaintUseCase {
  constructor(
    private complaintRepository: IComplaintRepository,
    private bookingRepository: IBookingRepository,
    private walletRepository: IWalletRepository,
    private sendNotificationUseCase: ISendNotificationUseCase
  ) {}

  async rejectComplaint(complaintId: string, adminComment: string): Promise<ComplaintEntity | null> {
    const complaint = await this.complaintRepository.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");
    if (complaint.status !== "pending") throw new Error("Complaint already processed");

    const booking = await this.bookingRepository.findById(complaint.bookingId);
    if (!booking) throw new Error("Booking not found");

    // In case of rejection (dismissal), the creator gets the payment
    const creatorId = typeof complaint.creatorId === 'string' 
      ? complaint.creatorId 
      : (complaint.creatorId as any)._id;

    await this.walletRepository.updateBalance(creatorId, "creator", booking.amount, {
      amount: booking.amount,
      type: "credit",
      description: `Payment for booking ${booking.id || (booking as any).id} - Complaint Rejected`,
      source: "booking",
      sourceId: complaint.bookingId,
    });

    complaint.status = "dismissed";
    complaint.adminComment = adminComment;
    
    const updatedComplaint = await this.complaintRepository.update(complaint);

    // Send notification to user
    try {
      const userId = typeof complaint.userId === 'string' ? complaint.userId : (complaint.userId as any)._id?.toString();
      if (userId) {
        await this.sendNotificationUseCase.sendNotification({
          recipientId: userId,
          type: NotificationType.REPORT,
          title: "Complaint Update - Rejected",
          message: `Your complaint for booking ${booking.id || (booking as any).id} has been reviewed and rejected. Admin feedback: ${adminComment}`,
          isRead: false,
          metadata: { 
            complaintId: updatedComplaint?._id?.toString(), 
            status: updatedComplaint?.status, 
            bookingId: booking.id || (booking as any).id || (booking as any)._id?.toString()
          }
        });
      }

      // Also notify creator
      const creatorIdStr = typeof creatorId === 'string' ? creatorId : (creatorId as any)._id?.toString();
      if (creatorIdStr) {
        await this.sendNotificationUseCase.sendNotification({
          recipientId: creatorIdStr,
          type: NotificationType.REPORT,
          title: "Complaint Update - Dismissed",
          message: `A complaint for booking ${booking.id || (booking as any).id} has been dismissed in your favor. Payment released. Admin feedback: ${adminComment}`,
          isRead: false,
          metadata: { 
            complaintId: updatedComplaint?._id?.toString(), 
            status: updatedComplaint?.status, 
            bookingId: booking.id || (booking as any).id || (booking as any)._id?.toString()
          }
        });
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }

    return updatedComplaint;
  }
}

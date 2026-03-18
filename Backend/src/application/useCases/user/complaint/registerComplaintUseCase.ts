import { ComplaintRequestDTO } from "@/domain/dto/complaint/complaintRequestDto";
import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { NotificationType } from "@/domain/entities/notificationEntity";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { IRegisterComplaintUseCase } from "@/domain/interface/user/complaint/IRegisterComplaintUseCase";

export class RegisterComplaintUseCase implements IRegisterComplaintUseCase {
  constructor(
    private complaintRepository: IComplaintRepository,
    private bookingRepository: IBookingRepository,
    private userRepository: IUserRepository,
    private sendNotificationUseCase: ISendNotificationUseCase
  ) {}

  async registerComplaint(userId: string, dto: ComplaintRequestDTO): Promise<ComplaintEntity> {
    const booking = await this.bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    const existingComplaint = await this.complaintRepository.findByBookingId(dto.bookingId);
    if (existingComplaint) {
      throw new Error("A complaint has already been registered for this booking. You can only report once.");
    }

    const today = new Date();
    const scheduledDate = new Date(booking.bookingDate);

    if (today.toDateString() !== scheduledDate.toDateString()) {
      throw new Error("Reports can only be filed on the scheduled booking date. You cannot report before or after.");
    }

    const complaint: ComplaintEntity = {
      ...dto,
      userId,
      status: "pending",
    };
    const createdComplaint = await this.complaintRepository.create(complaint);

    try {
      const adminId = await this.userRepository.findAdminId();
      if (adminId) {
        await this.sendNotificationUseCase.sendNotification({
          recipientId: adminId,
          type: NotificationType.REPORT,
          title: "New Complaint Received",
          message: `A new complaint has been filed for booking ID: ${booking.id || dto.bookingId}. Reason: ${dto.reason}`,
          isRead: false,
          metadata: {
            complaintId: createdComplaint._id?.toString(),
            bookingId: dto.bookingId
          }
        });
      }
    } catch (error) {
      console.error("Failed to send notification to admin:", error);
    }

    return createdComplaint;
  }
}

import type { ComplaintRequestDTO } from "@/domain/dto/complaint/complaintRequestDto";
import { NotificationType } from "@/domain/entities/notificationEntity";
import type { ISendNotificationUseCase } from "@/domain/interfaces/notification/ISendNotificationUseCase";
import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";
import type { IComplaintRepository } from "@/domain/interfaces/repository/IComplaintRepository";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { IRegisterComplaintUseCase } from "@/domain/interfaces/user/complaint/IRegisterComplaintUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import type { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";
import { ComplaintMapper } from "@/application/mapper/user/complaintMapper";
import type { ComplaintEntity } from "@/domain/entities/complaintEntity";

export class RegisterComplaintUseCase implements IRegisterComplaintUseCase {
  constructor(
    private complaintRepository: IComplaintRepository,
    private bookingRepository: IBookingRepository,
    private userRepository: IUserRepository,
    private sendNotificationUseCase: ISendNotificationUseCase
  ) {}

  async registerComplaint(userId: string, dto: ComplaintRequestDTO): Promise<ComplaintResponseDTO> {
    const booking = await this.bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new Error(MESSAGES.BOOKING.NOT_FOUND);
    }

    const existingComplaint = await this.complaintRepository.findByBookingId(dto.bookingId);
    if (existingComplaint) {
      throw new Error(MESSAGES.COMPLAINT.ALREADY_REGISTERED);
    }

    const today = new Date();
    const scheduledDate = new Date(booking.bookingDate);

    if (today.toDateString() !== scheduledDate.toDateString()) {
      throw new Error(MESSAGES.COMPLAINT.DATE_RESTRICTION);
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

    return ComplaintMapper.toDto(createdComplaint);
  }
}

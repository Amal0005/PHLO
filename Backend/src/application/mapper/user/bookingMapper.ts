import { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import { BookingEntity } from "@/domain/entities/bookingEntity";
import { PackageEntity } from "@/domain/entities/packageEntity";
import { BookingDocument } from "@/framework/database/model/bookingModel";

export class BookingMapper {
  static toDto(booking: BookingEntity): BookingResponseDTO {
    const dto: BookingResponseDTO = {
      id: booking.id!,
      userId: booking.userId,
      packageId: typeof booking.packageId === 'string' ? booking.packageId : (booking.packageId as any)._id.toString(),
      amount: booking.amount,
      status: booking.status,
      createdAt: booking.createdAt!,
    };

    if (typeof booking.packageId === 'object') {
      const pkg = booking.packageId as PackageEntity;
      dto.packageDetails = {
        title: pkg.title,
        description: pkg.description,
        images: pkg.images
      };
    }
    return dto;
  }

  static toEntity(doc: BookingDocument): BookingEntity {
    const isPopulated = doc.packageId && typeof doc.packageId === 'object' && ('title' in (doc.packageId as any));

    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      packageId: isPopulated ? (doc.packageId as unknown as PackageEntity) : doc.packageId.toString(),
      amount: doc.amount,
      currency: doc.currency as "inr",
      status: doc.status,
      stripeSessionId: doc.stripeSessionId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

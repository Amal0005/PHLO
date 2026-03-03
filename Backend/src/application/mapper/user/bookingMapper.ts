import { BookingResponseDTO } from "@/domain/dto/booking/bookingResponseDto";
import { BookingEntity } from "@/domain/entities/bookingEntity";
import { PackageEntity } from "@/domain/entities/packageEntity";
import { User } from "@/domain/entities/userEntities";
import { BookingDocument } from "@/framework/database/model/bookingModel";

export class BookingMapper {
  static toDto(booking: BookingEntity): BookingResponseDTO {
    const dto: BookingResponseDTO = {
      id: booking.id!,
      userId: typeof booking.userId === 'string' ? booking.userId : (booking.userId as User)._id!.toString(),
      packageId: typeof booking.packageId === 'string' ? booking.packageId : (booking.packageId as PackageEntity)._id!.toString(),
      amount: booking.amount,
      currency: booking.currency,
      status: booking.status,
      createdAt: booking.createdAt!,
      bookingDate: booking.bookingDate!,
      location: booking.location,
      sessionId: booking.stripeSessionId!,
    };

    if (typeof booking.userId === 'object') {
      const user = booking.userId as User;
      dto.userDetails = {
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
    }

    if (typeof booking.packageId === 'object') {
      const pkg = booking.packageId as PackageEntity;
      dto.packageDetails = {
        title: pkg.title,
        description: pkg.description,
        images: pkg.images,
        price: pkg.price,
        category: pkg.category,
      };
    }
    return dto;
  }

  static toEntity(doc: BookingDocument): BookingEntity {
    const isPackagePopulated = doc.packageId && typeof doc.packageId === 'object' && 'title' in doc.packageId;
    const isUserPopulated = doc.userId && typeof doc.userId === 'object' && 'name' in doc.userId;

    return {
      id: doc._id.toString(),
      userId: isUserPopulated ? (doc.userId as User) : doc.userId.toString(),
      packageId: isPackagePopulated ? (doc.packageId as PackageEntity) : doc.packageId.toString(),
      amount: doc.amount,
      currency: doc.currency as "inr",
      status: doc.status,
      stripeSessionId: doc.stripeSessionId,
      bookingDate: doc.bookingDate,
      location: doc.location,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

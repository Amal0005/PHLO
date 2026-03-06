import { ReviewEntity } from "@/domain/entities/reviewEntity";
import { IReviewModel } from "@/framework/database/model/reviewModel";
import { User } from "@/domain/entities/userEntities";
import { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";
import { PackageEntity } from "@/domain/entities/packageEntity";

export class ReviewMapper {
    static toEntity(doc: IReviewModel): ReviewEntity {
        return {
            id: doc._id.toString(),
            userId: doc.userId,
            packageId: doc.packageId,
            bookingId: doc.bookingId,
            rating: doc.rating,
            comment: doc.comment,
            createdAt: doc.createdAt,
        };
    }

    static toDto(entity: ReviewEntity): ReviewResponseDTO {
        const user = entity.userId as User;
        const pkg = entity.packageId as PackageEntity;

        const isUserPopulated = !!(user && typeof user === "object" && user.name);
        const isPkgPopulated = !!(pkg && typeof pkg === "object" && pkg.title);

        return {
            id: entity.id!,
            userId: isUserPopulated ? (user._id?.toString() || "") : entity.userId.toString(),
            userName: isUserPopulated ? user.name : "Unknown",
            userPhoto: isUserPopulated ? user.image : undefined,
            packageId: isPkgPopulated ? (pkg._id?.toString() || "") : entity.packageId.toString(),
            rating: entity.rating,
            comment: entity.comment,
            createdAt: entity.createdAt!
        };
    }
}

import type { ReviewEntity } from "@/domain/entities/reviewEntity";
import type { User } from "@/domain/entities/userEntities";
import type { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";
import type { PackageEntity } from "@/domain/entities/packageEntity";

export class ReviewMapper {
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

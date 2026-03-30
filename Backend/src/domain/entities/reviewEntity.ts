import type { User } from "@/domain/entities/userEntities";
import type { PackageEntity } from "@/domain/entities/packageEntity";

export interface ReviewEntity {
    id?: string,
    userId: string | User,
    packageId: string | PackageEntity,
    bookingId: string,
    rating: number,
    comment: string,
    createdAt?: Date
}
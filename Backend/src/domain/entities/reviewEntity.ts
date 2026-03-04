import { User } from "./userEntities";
import { PackageEntity } from "./packageEntity";

export interface ReviewEntity {
    id?: string,
    userId: string | User,
    packageId: string | PackageEntity,
    bookingId: string,
    rating: number,
    comment: string,
    createdAt?: Date
}
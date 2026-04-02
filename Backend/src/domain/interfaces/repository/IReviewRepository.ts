import type { ReviewEntity } from "@/domain/entities/reviewEntity";
import type { IBaseRepository } from "@/domain/interfaces/repository/IBaseRepository";

export interface IReviewRepository extends IBaseRepository<ReviewEntity> {
  findByPackageId(packageId: string): Promise<ReviewEntity[]>;
  findByBookingId(bookingId: string): Promise<ReviewEntity | null>;
  isExists(bookingId: string): Promise<boolean>;
}

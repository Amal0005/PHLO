import { ReviewEntity } from "@/domain/entities/reviewEntity";

export interface IEditReviewUseCase {
    editReview(userId: string, reviewId: string, rating: number, comment: string): Promise<ReviewEntity>;
}

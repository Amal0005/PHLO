import { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";

export interface IEditReviewUseCase {
    editReview(userId: string, reviewId: string, rating: number, comment: string): Promise<ReviewResponseDTO>;
}

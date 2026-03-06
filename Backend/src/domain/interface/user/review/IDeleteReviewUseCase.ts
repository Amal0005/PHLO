export interface IDeleteReviewUseCase {
    deleteReview(userId: string, reviewId: string): Promise<void>;
}

import { ReviewEntity } from "@/domain/entities/reviewEntity";
import { AppError } from "@/domain/errors/appError";
import { IReviewRepository } from "@/domain/interface/repositories/IReviewRepository";
import { IEditReviewUseCase } from "@/domain/interface/user/review/IEditReviewUseCase";
import { StatusCode } from "@/utils/statusCodes";

export class EditReviewUseCase implements IEditReviewUseCase {
    constructor(
        private _reviewRepo: IReviewRepository,
    ) {}

    async editReview(userId: string, reviewId: string, rating: number, comment: string): Promise<ReviewEntity> {
        const review = await this._reviewRepo.findById(reviewId);
        if (!review) {
            throw new AppError("Review not found", StatusCode.NOT_FOUND);
        }

    
        let revUserId = review.userId;
        if (typeof review.userId === 'object' && review.userId !== null) {
            const userObj = review.userId as { _id?: string; id?: string };
            revUserId = userObj._id || userObj.id || review.userId;
        }

        if (revUserId.toString() !== userId.toString()) {
            throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);
        }

        const updatedReview = await this._reviewRepo.update(reviewId, {
            rating,
            comment,
        });

        if (!updatedReview) {
            throw new AppError("Failed to update", StatusCode.INTERNAL_SERVER_ERROR);
        }

        return updatedReview;
    }
}

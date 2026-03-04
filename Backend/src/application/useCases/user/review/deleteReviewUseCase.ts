import { AppError } from "@/domain/errors/appError";
import { IReviewRepository } from "@/domain/interface/repositories/IReviewRepository";
import { IDeleteReviewUseCase } from "@/domain/interface/user/review/IDeleteReviewUseCase";
import { StatusCode } from "@/utils/statusCodes";

export class DeleteReviewUseCase implements IDeleteReviewUseCase {
    constructor(
        private _reviewRepo: IReviewRepository,
    ) { }
    async deleteReview(userId: string, reviewId: string): Promise<void> {
        const review = await this._reviewRepo.findById(reviewId)
        if (!review) throw new AppError("Review Not Found", StatusCode.NOT_FOUND)
        const reviewUserId = typeof review.userId === "string" ? review.userId : review.userId.toString()
        if (reviewUserId !== userId) throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED)
        await this._reviewRepo.delete(reviewId)
    }
}
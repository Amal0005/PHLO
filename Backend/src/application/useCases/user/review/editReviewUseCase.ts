import type { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";
import { ReviewMapper } from "@/application/mapper/user/reviewMapper";
import { AppError } from "@/domain/errors/appError";
import type { IReviewRepository } from "@/domain/interfaces/repository/IReviewRepository";
import type { IEditReviewUseCase } from "@/domain/interfaces/user/review/IEditReviewUseCase";
import { StatusCode } from "@/constants/statusCodes";

export class EditReviewUseCase implements IEditReviewUseCase {
    constructor(
        private _reviewRepo: IReviewRepository,
    ) {}

    async editReview(userId: string, reviewId: string, rating: number, comment: string): Promise<ReviewResponseDTO> {
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

        return ReviewMapper.toDto(updatedReview);
    }
}

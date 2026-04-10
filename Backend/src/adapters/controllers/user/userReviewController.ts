import type { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import type { IAddReviewUseCase } from "@/domain/interfaces/user/review/IAddReviewUseCase";
import type { IDeleteReviewUseCase } from "@/domain/interfaces/user/review/IDeleteReviewUseCase";
import type { IEditReviewUseCase } from "@/domain/interfaces/user/review/IEditReviewUseCase";
import type { IGetReviewByBookingUseCase } from "@/domain/interfaces/user/review/IGetReviewByBookingUseCase";
import type { IGetReviewUseCase } from "@/domain/interfaces/user/review/IGetReviewUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import { StatusCode } from "@/constants/statusCodes";
import type { Request, Response } from "express";

export class ReviewController {
    constructor(
        private _addReviewUseCase: IAddReviewUseCase,
        private _deleteReviewUseCase: IDeleteReviewUseCase,
        private _getReviewUseCase: IGetReviewUseCase,
        private _getReviewByBookingUseCase: IGetReviewByBookingUseCase,
        private _editReviewUseCase: IEditReviewUseCase
    ) {}
    async addReview(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user!.userId
        const data = req.body
        await this._addReviewUseCase.addReview(userId, data)
        res.status(StatusCode.CREATED).json({ success: true, message: MESSAGES.REVIEW.ADDED });

    }
    async deleteReview(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user!.userId
        const reviewId = req.params.reviewId
        await this._deleteReviewUseCase.deleteReview(userId, reviewId);
        res.status(StatusCode.OK).json({ success: true, message: MESSAGES.REVIEW.DELETED })
    }
    async getReviewByBooking(req: AuthRequest, res: Response): Promise<void> {
        const bookingId = req.params.bookingId
        const review = await this._getReviewByBookingUseCase.getReviewByBooking(bookingId)
        res.status(StatusCode.OK).json({ success: true, data: review });
    }
    async getReview(req: Request, res: Response): Promise<void> {
        const packageId = req.params.packageId
        const reviews = await this._getReviewUseCase.getReview(packageId)
        res.status(StatusCode.OK).json({ success: true, data: reviews });
    }

    async updateReview(req: AuthRequest, res: Response): Promise<void> {
        const { reviewId } = req.params;
        const userId = req.user!.userId;
        const { rating, comment } = req.body;
        const result = await this._editReviewUseCase.editReview(userId, reviewId, rating, comment);
        res.status(StatusCode.OK).json({ success: true, data: result, message: MESSAGES.REVIEW.UPDATED });
    }
}
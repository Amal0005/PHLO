import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IAddReviewUseCase } from "@/domain/interface/user/review/IAddReviewUseCase";
import { IDeleteReviewUseCase } from "@/domain/interface/user/review/IDeleteReviewUseCase";
import { IEditReviewUseCase } from "@/domain/interface/user/review/IEditReviewUseCase";
import { IGetReviewByBookingUseCase } from "@/domain/interface/user/review/IGetReviewByBookingUseCase";
import { IGetReviewUseCase } from "@/domain/interface/user/review/IGetReviewUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import { StatusCode } from "@/constants/statusCodes";
import { Request, Response } from "express";

export class ReviewController {
    constructor(
        private _addReviewUseCase: IAddReviewUseCase,
        private _deleteReviewUseCase: IDeleteReviewUseCase,
        private _getReviewUseCase: IGetReviewUseCase,
        private _getReviewByBookingUseCase: IGetReviewByBookingUseCase,
        private _editReviewUseCase: IEditReviewUseCase
    ) { }
    async addReview(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user!.userId
        const data = req.body
        console.log(data, userId, "Data from review controller")
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
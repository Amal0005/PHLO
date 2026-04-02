import type { reviewRequestDTO } from "@/domain/dto/user/review/reviewRequestDto";
import { AppError } from "@/domain/errors/appError";
import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";
import type { IReviewRepository } from "@/domain/interfaces/repository/IReviewRepository";
import type { IAddReviewUseCase } from "@/domain/interfaces/user/review/IAddReviewUseCase";
import { StatusCode } from "@/constants/statusCodes";

export class AddReviewUseCase implements IAddReviewUseCase {
    constructor(
        private _reviewRepo: IReviewRepository,
        private _bookingRepo: IBookingRepository
    ) {}
    async addReview(userId: string, data: reviewRequestDTO): Promise<void> {
        const booking = await this._bookingRepo.findById(data.bookingId)
        console.log("booooo", booking)
        if (!booking) throw new AppError("Booking not found", StatusCode.NOT_FOUND)
        const bookingUserId = typeof booking.userId === "object" ? booking.userId._id?.toString() : booking.userId;
        if (bookingUserId !== userId) throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);
        if (new Date(booking.bookingDate) >= new Date()) throw new AppError("Cannot review before completion", StatusCode.BAD_REQUEST);

        const alreadyDone = await this._reviewRepo.isExists(data.bookingId)
        if (alreadyDone) throw new AppError("Already Done", StatusCode.CONFLICT);
        await this._reviewRepo.create({ ...data, userId })

    }
}
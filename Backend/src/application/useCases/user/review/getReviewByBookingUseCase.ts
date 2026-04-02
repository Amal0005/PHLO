import { ReviewMapper } from "@/application/mapper/user/reviewMapper";
import type { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";
import type { IReviewRepository } from "@/domain/interfaces/repository/IReviewRepository";
import type { IGetReviewByBookingUseCase } from "@/domain/interfaces/user/review/IGetReviewByBookingUseCase";

export class GetReviewByBookingUseCase implements IGetReviewByBookingUseCase {
    constructor(
        private _reviewRepo: IReviewRepository
    ) {}
    async getReviewByBooking(bookingId: string): Promise<ReviewResponseDTO | null> {
        const review = await this._reviewRepo.findByBookingId(bookingId)
        return review ? ReviewMapper.toDto(review) : null
    }
}

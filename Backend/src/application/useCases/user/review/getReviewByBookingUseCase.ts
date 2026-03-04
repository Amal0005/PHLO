import { ReviewMapper } from "@/application/mapper/user/reviewMapper";
import { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";
import { IReviewRepository } from "@/domain/interface/repositories/IReviewRepository";
import { IGetReviewByBookingUseCase } from "@/domain/interface/user/review/IGetReviewByBookingUseCase";

export class GetReviewByBookingUseCase implements IGetReviewByBookingUseCase {
    constructor(
        private _reviewRepo: IReviewRepository
    ) { }
    async getReviewByBooking(bookingId: string): Promise<ReviewResponseDTO | null> {
        const review = await this._reviewRepo.findByBookingId(bookingId)
        return review ? ReviewMapper.toDto(review) : null
    }
}

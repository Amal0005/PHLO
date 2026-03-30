import type { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";

export interface IGetReviewByBookingUseCase {
    getReviewByBooking(bookingId: string): Promise<ReviewResponseDTO | null>;
}

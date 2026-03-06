import { reviewRequestDTO } from "@/domain/dto/user/review/reviewRequestDto";

export interface IAddReviewUseCase {
    addReview(userId: string, data: reviewRequestDTO): Promise<void>;
}

import { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";

export interface IGetReviewUseCase {
    getReview(packageId:string):Promise<ReviewResponseDTO[]>
}
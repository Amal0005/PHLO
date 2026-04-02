import { ReviewMapper } from "@/application/mapper/user/reviewMapper";
import type { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";
import type { IReviewRepository } from "@/domain/interfaces/repository/IReviewRepository";
import type { IGetReviewUseCase } from "@/domain/interfaces/user/review/IGetReviewUseCase";

export class GetReviewUseCase implements IGetReviewUseCase{
    constructor(
        private _reviewRepo:IReviewRepository
    ){}
    async getReview(packageId: string): Promise<ReviewResponseDTO[]> {
        const reviews=await this._reviewRepo.findByPackageId(packageId)
        return reviews.map((item)=>ReviewMapper.toDto(item))
    }
}
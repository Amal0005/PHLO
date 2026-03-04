import { ReviewMapper } from "@/application/mapper/user/reviewMapper";
import { ReviewResponseDTO } from "@/domain/dto/user/review/reviewResponseDto";
import { IReviewRepository } from "@/domain/interface/repositories/IReviewRepository";
import { IGetReviewUseCase } from "@/domain/interface/user/review/IGetReviewUseCase";

export class GetReviewUseCase implements IGetReviewUseCase{
    constructor(
        private _reviewRepo:IReviewRepository
    ){}
    async getReview(packageId: string): Promise<ReviewResponseDTO[]> {
        const reviews=await this._reviewRepo.findByPackageId(packageId)
        return reviews.map((item)=>ReviewMapper.toDto(item))
    }
}
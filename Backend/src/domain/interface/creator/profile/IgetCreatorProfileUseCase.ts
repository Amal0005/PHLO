import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";

export interface IGetCreatorProfileUseCase {
    getProfile(creatorId: string): Promise<CreatorResponseDto | null>
}

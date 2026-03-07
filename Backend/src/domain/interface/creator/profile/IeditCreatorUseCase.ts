import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";

export interface IeditCreatorProfileUseCase {
    editProfile(creatorId: string, data: any): Promise<CreatorResponseDto | null>
}

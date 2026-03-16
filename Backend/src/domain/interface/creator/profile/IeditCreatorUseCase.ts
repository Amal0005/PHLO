import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";

export interface IeditCreatorProfileUseCase {
    editProfile(creatorId: string, data: Record<string, unknown>): Promise<CreatorResponseDto | null>
}

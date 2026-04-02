import type { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import type { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IRegisterCreatorUseCase {
  registerCreator(data: CreatorEntity): Promise<CreatorResponseDto>;
}

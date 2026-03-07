import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IRegisterCreatorUseCase {
  registerCreator(data: CreatorEntity): Promise<CreatorResponseDto>;
}

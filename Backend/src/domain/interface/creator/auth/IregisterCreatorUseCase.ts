import { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IRegisterCreatorUseCase {
  registerCreator(data: CreatorEntity): Promise<CreatorEntity>;
}

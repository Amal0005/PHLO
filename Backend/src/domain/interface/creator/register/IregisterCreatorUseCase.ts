import { CreatorEntity } from "../../../entities/creatorEntities";

export interface IregisterCreatorUseCase {
  registerCreator(data: CreatorEntity): Promise<CreatorEntity>;
}
import { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IregisterCreatorUseCase {
  registerCreator(data: CreatorEntity): Promise<CreatorEntity>;
  checkExists(email: string): Promise<void>;
}
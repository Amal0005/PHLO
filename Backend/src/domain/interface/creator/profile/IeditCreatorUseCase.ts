import { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IeditCreatorProfileUseCase {
    editProfile(creatorId:string,data:Partial<CreatorEntity>):Promise<CreatorEntity|null>
}

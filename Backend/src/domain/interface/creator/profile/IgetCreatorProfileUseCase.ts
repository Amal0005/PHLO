import { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IGetCreatorProfileUseCase {
    getProfile(creatorId:string):Promise<CreatorEntity|null>
}

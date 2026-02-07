import { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IgetCreatorProfileUseCase {
    getProfile(creatorId:string):Promise<CreatorEntity|null>
}
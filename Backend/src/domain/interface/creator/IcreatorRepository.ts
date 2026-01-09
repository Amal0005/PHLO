import { CreatorEntity } from "../../entities/creatorEntities";

export interface IcreatorRepository{
    createCreator(data:CreatorEntity,):Promise<CreatorEntity>
    findByEmail(email:string):Promise<CreatorEntity|null>
    updateStatus(createrId:string,status:"approved"|"rejected"):Promise<void>
    // getPendingCreators():Promise<CreatorEntity[]>

}
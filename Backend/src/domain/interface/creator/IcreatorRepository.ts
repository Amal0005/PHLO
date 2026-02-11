import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface ICreatorRepository {
    createCreator(data: CreatorEntity,): Promise<CreatorEntity>
    findByEmail(email: string): Promise<CreatorEntity | null>
    findById(id: string): Promise<CreatorEntity | null>;
    updateStatus(createrId: string, status: "pending" | "approved" | "rejected"|"blocked", reason?: string): Promise<void>
    updatePassword(email: string, hashedPassword: string): Promise<void>;
  findAllCreators(page: number,limit: number): Promise<PaginatedResult<CreatorEntity>>;
    findByPhone(phone:string|undefined):Promise<CreatorEntity|null>
    updateProfile(creatorId:string,data:Partial<CreatorEntity>):Promise<CreatorEntity|null>

}

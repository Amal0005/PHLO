import { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IcreatorRepository {
    createCreator(data: CreatorEntity,): Promise<CreatorEntity>
    findByEmail(email: string): Promise<CreatorEntity | null>
    findById(id: string): Promise<CreatorEntity | null>;
    updateStatus(createrId: string, status: "pending" | "approved" | "rejected", reason?: string): Promise<void>
    updatePassword(email: string, hashedPassword: string): Promise<void>;
    findAllCreators(): Promise<CreatorEntity[]>

}
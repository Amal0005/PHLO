import { User } from "@/domain/entities/userEntities";

export interface IgetUserProfileUseCase{
    getProfile(userId:string):Promise<User|null>
}

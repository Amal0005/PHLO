import { User } from "@/domain/entities/userEntities";

export interface IGetUserProfileUseCase{
    getProfile(userId:string):Promise<User|null>
}


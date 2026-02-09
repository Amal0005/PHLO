import { User } from "@/domain/entities/userEntities";

export interface IeditUserProfileUseCase{
    editProfile(userId:string, data: {
      name?: string;
      phone?: string;
      image?: string;
      email?:string
    }):Promise<User|null>
}
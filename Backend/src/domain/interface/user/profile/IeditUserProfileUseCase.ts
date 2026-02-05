import { User } from "@/domain/entities/userEntities";

export interface IeditUserProfileUseCase{
    editProfile(userId:string, data: {
      name?: string;
      phone?: string;
      image?: string;
    }):Promise<User|null>
}
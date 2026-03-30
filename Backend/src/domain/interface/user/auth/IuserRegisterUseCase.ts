import type { RegisterDto } from "@/domain/dto/user/registerDto";

export interface IUserRegisterUseCase {
    registerUser(user:RegisterDto):Promise<void>

}

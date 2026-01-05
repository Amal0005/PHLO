import { RegisterDto } from "../../../dto/user/auth/registerDto";

export interface IuserRegisterUseCase {
    registerUser(user:RegisterDto):Promise<void>

}
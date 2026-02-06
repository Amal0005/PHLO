import { RegisterDto } from "../../../dto/user/registerDto";

export interface IuserRegisterUseCase {
    registerUser(user:RegisterDto):Promise<void>

}
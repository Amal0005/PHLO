import { RegisterDto } from "../../../dto/user/registerDto";

export interface IUserRegisterUseCase {
    registerUser(user:RegisterDto):Promise<void>

}

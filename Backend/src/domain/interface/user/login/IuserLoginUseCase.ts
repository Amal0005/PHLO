import { loginDto } from "../../../dto/user/auth/loginDto";
import { UserDto } from "../../../dto/user/auth/userDto";

export interface IuserLoginUseCase{
    loginUser(user:loginDto):Promise<UserDto>
}
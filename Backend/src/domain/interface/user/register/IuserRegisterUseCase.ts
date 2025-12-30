import { User } from "../../../entities/userEntities";

export interface IuserRegisterUseCase {
    registerUser(user:User):Promise<User>
}
import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IuserRegisterUseCase } from "../../../domain/interface/user/register/IuserRegisterUseCase";

export class userRegisterUseCase implements IuserRegisterUseCase{
    constructor(private _userRepo:IuserRepository){}

    async registerUser(user: User): Promise<User> {
        const existingUser=await this._userRepo.findByEmail(user.email)
        if(existingUser) throw new Error("already exists")
        const newUser=await this._userRepo.createUser(user)
        return newUser
    }
}
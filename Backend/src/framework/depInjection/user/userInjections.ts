import { userRegisterController } from "../../../adapters/controllers/user/register/userRegisterController";
import { userRepository } from "../../../adapters/repository/user/userRepository";
import { userRegisterUseCase } from "../../../useCases/user/register/registerUserUseCase";

const userRepo=new userRepository()



const registerUseCase=new userRegisterUseCase(userRepo)



export const registerController=new userRegisterController(registerUseCase)



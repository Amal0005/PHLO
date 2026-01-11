import { AdminLoginController } from "../../../adapters/controllers/admin/adminLoginController";
import { userRepository } from "../../../adapters/repository/user/userRepository";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { PasswordService } from "../../../domain/services/user/passwordService";
import { AdminLoginUseCase } from "../../../useCases/admin/adminLoginUseCase";

const userRepo=new userRepository
const jwtService=new JwtServices
const passwordService=new PasswordService

 const adminLoginUseCase=new AdminLoginUseCase(userRepo,passwordService,jwtService)

export const adminLoginController=new AdminLoginController(adminLoginUseCase)
import { AdminLoginController } from "../../../adapters/controllers/admin/adminLoginController";
import { AdminUserController } from "../../../adapters/controllers/admin/adminUserController";
import { CreatorRepository } from "../../../adapters/repository/creator/creatorRepository";
import { userRepository } from "../../../adapters/repository/user/userRepository";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { PasswordService } from "../../../domain/services/user/passwordService";
import { AdminLoginUseCase } from "../../../useCases/admin/adminLoginUseCase";
import { AdminUserListingUseCase } from "../../../useCases/admin/adminUserListingUseCase";
import { AdminCreatorListingUseCase } from "../../../useCases/creator/adminCreatorListingUseCase";

const userRepo=new userRepository
const jwtService=new JwtServices
const passwordService=new PasswordService
const creatorRepo=new CreatorRepository

 const adminLoginUseCase=new AdminLoginUseCase(userRepo,passwordService,jwtService)
 const adminUserlistingUseCase=new AdminUserListingUseCase(userRepo)
 const adminCreatorListingUseCase=new AdminCreatorListingUseCase(creatorRepo)

export const adminLoginController=new AdminLoginController(adminLoginUseCase)
export const adminUserController=new AdminUserController(adminUserlistingUseCase,adminCreatorListingUseCase)
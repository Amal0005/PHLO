import { AdminCreatorController } from "../../../adapters/controllers/admin/adminCreatorController";
import { AdminLoginController } from "../../../adapters/controllers/admin/adminLoginController";
import { AdminUserController } from "../../../adapters/controllers/admin/adminUserController";
import { CreatorRepository } from "../../../adapters/repository/creator/creatorRepository";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { PasswordService } from "../../../domain/services/user/passwordService";
import { AdminLoginUseCase } from "../../../useCases/admin/adminLoginUseCase";
import { AdminUserListingUseCase } from "../../../useCases/admin/adminUserListingUseCase";
import { AdminCreatorListingUseCase } from "../../../useCases/admin/adminCreatorListingUseCase";
import { ToggleUserStatusUseCase } from "../../../useCases/admin/toggleUserStatusUseCase";
import { ApproveCreatorUseCase } from "../../../useCases/admin/approveCreatorUseCase";
import { RejectCreatorUseCase } from "../../../useCases/admin/rejectCreatorUseCase";
import { ToggleCreatorStatusUseCase } from "@/useCases/admin/toggleCreatorStatusUseCase";
import { MailService } from "@/domain/services/user/mailServices";
import { CategoryRepository } from "@/adapters/repository/admin/categoryRepository";
import { AddCategoryUseCase } from "@/useCases/admin/addCategoryUseCase";
import { GetCategoryUseCase } from "@/useCases/admin/getCategoryUseCase";
import { DeleteCategoryUseCase } from "@/useCases/admin/deleteCategoryUseCase";
import { AdminCategoryController } from "@/adapters/controllers/admin/adminCategoryController";
import { EditCategoryUseCase } from "@/useCases/admin/editCategoryUseCase";

const userRepo = new UserRepository();
const creatorRepo = new CreatorRepository();
const categoryRepo=new CategoryRepository()
const jwtService = new JwtServices();
const passwordService = new PasswordService();
const mailService= new MailService()


const adminLoginUseCase = new AdminLoginUseCase(userRepo, passwordService, jwtService);
const adminUserlistingUseCase = new AdminUserListingUseCase(userRepo);
const adminCreatorListingUseCase = new AdminCreatorListingUseCase(creatorRepo);
const toggleUserStatusUseCase = new ToggleUserStatusUseCase(userRepo);
const approveCreatorUseCase = new ApproveCreatorUseCase(creatorRepo,mailService);
const rejectCreatorUseCase = new RejectCreatorUseCase(creatorRepo);
const toggleCreatorStatusUseCase=new ToggleCreatorStatusUseCase(creatorRepo)
const addCategoryUseCase=new AddCategoryUseCase(categoryRepo)
const getCategoryUseCase=new GetCategoryUseCase(categoryRepo)
const deleteCategoryUseCase=new DeleteCategoryUseCase(categoryRepo)
const editCategoryUseCase = new EditCategoryUseCase(categoryRepo)

export const adminLoginController = new AdminLoginController(adminLoginUseCase);
export const adminUserController = new AdminUserController(adminUserlistingUseCase,toggleUserStatusUseCase);
export const adminCreatorController = new AdminCreatorController(approveCreatorUseCase,rejectCreatorUseCase,adminCreatorListingUseCase,toggleCreatorStatusUseCase);
export const adminCategoryController=new AdminCategoryController(addCategoryUseCase,getCategoryUseCase,deleteCategoryUseCase,editCategoryUseCase)
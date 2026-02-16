import { AdminCreatorController } from "../../../adapters/controllers/admin/adminCreatorController";
import { AdminLoginController } from "../../../adapters/controllers/admin/adminLoginController";
import { AdminUserController } from "../../../adapters/controllers/admin/adminUserController";
import { CreatorRepository } from "../../../adapters/repository/creator/creatorRepository";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { PasswordService } from "../../../domain/services/user/passwordService";
import { AdminLoginUseCase } from "../../../application/useCases/admin/adminLoginUseCase";
import { AdminUserListingUseCase } from "../../../application/useCases/admin/adminUserListingUseCase";
import { AdminCreatorListingUseCase } from "../../../application/useCases/admin/adminCreatorListingUseCase";
import { ToggleUserStatusUseCase } from "../../../application/useCases/admin/toggleUserStatusUseCase";
import { ApproveCreatorUseCase } from "../../../application/useCases/admin/approveCreatorUseCase";
import { RejectCreatorUseCase } from "../../../application/useCases/admin/rejectCreatorUseCase";
import { ToggleCreatorStatusUseCase } from "@/application/useCases/admin/toggleCreatorStatusUseCase";
import { MailService } from "@/domain/services/user/mailServices";
import { CategoryRepository } from "@/adapters/repository/admin/categoryRepository";
import { AddCategoryUseCase } from "@/application/useCases/admin/addCategoryUseCase";
import { GetCategoryUseCase } from "@/application/useCases/admin/getCategoryUseCase";
import { DeleteCategoryUseCase } from "@/application/useCases/admin/deleteCategoryUseCase";
import { AddCategoryController } from "@/adapters/controllers/admin/category/addCategoryController";
import { GetCategoryController } from "@/adapters/controllers/admin/category/getCategoryController";
import { DeleteCategoryController } from "@/adapters/controllers/admin/category/deleteCategoryController";
import { EditCategoryController } from "@/adapters/controllers/admin/category/editCategoryController";
import { EditCategoryUseCase } from "@/application/useCases/admin/editCategoryUseCase";
import { AdminCategoryListingUseCase } from "@/application/useCases/admin/adminCategoryListingUseCase";

const userRepo = new UserRepository();
const creatorRepo = new CreatorRepository();
const categoryRepo = new CategoryRepository()
const jwtService = new JwtServices();
const passwordService = new PasswordService();
const mailService = new MailService()


const adminLoginUseCase = new AdminLoginUseCase(userRepo, passwordService, jwtService);
const adminUserlistingUseCase = new AdminUserListingUseCase(userRepo);
const adminCreatorListingUseCase = new AdminCreatorListingUseCase(creatorRepo);
const toggleUserStatusUseCase = new ToggleUserStatusUseCase(userRepo);
const approveCreatorUseCase = new ApproveCreatorUseCase(creatorRepo, mailService);
const rejectCreatorUseCase = new RejectCreatorUseCase(creatorRepo);
const toggleCreatorStatusUseCase = new ToggleCreatorStatusUseCase(creatorRepo)
const addCategoryUseCase = new AddCategoryUseCase(categoryRepo)
const getCategoryUseCase = new GetCategoryUseCase(categoryRepo)
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo)
const editCategoryUseCase = new EditCategoryUseCase(categoryRepo)
const adminCategoryListingUseCase = new AdminCategoryListingUseCase(categoryRepo)

export const adminLoginController = new AdminLoginController(adminLoginUseCase);
export const adminUserController = new AdminUserController(adminUserlistingUseCase, toggleUserStatusUseCase);
export const adminCreatorController = new AdminCreatorController(approveCreatorUseCase, rejectCreatorUseCase, adminCreatorListingUseCase, toggleCreatorStatusUseCase);
export const addCategoryController = new AddCategoryController(addCategoryUseCase);
export const getCategoryController = new GetCategoryController(adminCategoryListingUseCase);
export const deleteCategoryController = new DeleteCategoryController(deleteCategoryUseCase);
export const editCategoryController = new EditCategoryController(editCategoryUseCase);

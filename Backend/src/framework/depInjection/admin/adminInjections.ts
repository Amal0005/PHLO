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
import { DeleteCategoryUseCase } from "@/application/useCases/admin/deleteCategoryUseCase";
import { EditCategoryUseCase } from "@/application/useCases/admin/editCategoryUseCase";
import { AdminCategoryListingUseCase } from "@/application/useCases/admin/adminCategoryListingUseCase";
import { CategoryController } from "@/adapters/controllers/admin/category/categoryController";
import { AddSubscriptionUseCase } from "@/application/useCases/admin/addSubscriptionUseCase";
import { SubscriptionRepository } from "@/adapters/repository/admin/subscriptionRepository";
import { AddSubscriptionController } from "@/adapters/controllers/admin/subscription/addSubscriptionController";
import { GetSubscriptionUseCase } from "@/application/useCases/admin/getSubscriptionUseCase";
import { GetSubscriptionController } from "@/adapters/controllers/admin/subscription/getSubscriptionController";
import { EditSubscriptionUseCase } from "@/application/useCases/admin/editSubscriptionUseCase";
import { EditSubscriptionController } from "@/adapters/controllers/admin/subscription/editSubscriptionController";
import { DeleteSubscriptionUseCase } from "@/domain/interface/admin/deleteSubscriptionUseCase";
import { DeleteSubscriptionController } from "@/adapters/controllers/admin/subscription/deleteSubscriptionController";
import { WallpaperRepository } from "@/adapters/repository/creator/wallpaperRepository";
import { GetApprovedWallpaperUseCase } from "@/application/useCases/user/wallpaper/getApprovedWallpaperUseCase";
import { UserWallpaperController } from "@/adapters/controllers/user/userWallpaperController";
import { ApproveWallpaperUseCase } from "@/application/useCases/admin/wallpaper/approveWallpaperUseCase";
import { RejectWallpaperUseCase } from "@/application/useCases/admin/wallpaper/rejectWallpaperUseCase";
import { GetAllWallpapersUseCase } from "@/application/useCases/admin/wallpaper/getAllWallpapersUseCase";
import { AdminWallpaperController } from "@/adapters/controllers/admin/adminWallpaperController";

const userRepo = new UserRepository();
const creatorRepo = new CreatorRepository();
const categoryRepo = new CategoryRepository()
const subscriptionRepo = new SubscriptionRepository()
const wallpaperRepo = new WallpaperRepository()

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
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo)
const editCategoryUseCase = new EditCategoryUseCase(categoryRepo)
const adminCategoryListingUseCase = new AdminCategoryListingUseCase(categoryRepo)
const addSubscriptionUseCase = new AddSubscriptionUseCase(subscriptionRepo)
const getSubscriptionUseCase = new GetSubscriptionUseCase(subscriptionRepo)
const editSubscriptionUseCase = new EditSubscriptionUseCase(subscriptionRepo)
const deleteSubscriptionUseCase = new DeleteSubscriptionUseCase(subscriptionRepo)
const approveWallpaperUseCase = new ApproveWallpaperUseCase(wallpaperRepo);
const rejectWallpaperUseCase = new RejectWallpaperUseCase(wallpaperRepo);
const getAllWallpapersUseCase = new GetAllWallpapersUseCase(wallpaperRepo);

export const adminLoginController = new AdminLoginController(adminLoginUseCase);
export const adminUserController = new AdminUserController(adminUserlistingUseCase, toggleUserStatusUseCase);
export const adminCreatorController = new AdminCreatorController(approveCreatorUseCase, rejectCreatorUseCase, adminCreatorListingUseCase, toggleCreatorStatusUseCase);
export const categoryController = new CategoryController(addCategoryUseCase, editCategoryUseCase, deleteCategoryUseCase, adminCategoryListingUseCase);
export const addSubscriptionController = new AddSubscriptionController(addSubscriptionUseCase)
export const getSubscriptionController = new GetSubscriptionController(getSubscriptionUseCase)
export const editSubscriptionController = new EditSubscriptionController(editSubscriptionUseCase)
export const deleteSubscriptionController = new DeleteSubscriptionController(deleteSubscriptionUseCase)
export const adminWallpaperController = new AdminWallpaperController(approveWallpaperUseCase, rejectWallpaperUseCase, getAllWallpapersUseCase);
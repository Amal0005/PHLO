import { AdminCreatorController } from "../../../adapters/controllers/admin/adminCreatorController";
import { AdminLoginController } from "../../../adapters/controllers/admin/adminLoginController";
import { AdminUserController } from "../../../adapters/controllers/admin/adminUserController";
import { CreatorRepository } from "../../../adapters/repository/creator/creatorRepository";
import { PackageRepository } from "../../../adapters/repository/creator/packageRepository";
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
import { CategoryController } from "@/adapters/controllers/admin/categoryController";
import { AddSubscriptionUseCase } from "@/application/useCases/admin/addSubscriptionUseCase";
import { SubscriptionRepository } from "@/adapters/repository/admin/subscriptionRepository";
import { GetSubscriptionUseCase } from "@/application/useCases/admin/getSubscriptionUseCase";
import { EditSubscriptionUseCase } from "@/application/useCases/admin/editSubscriptionUseCase";
import { SubscriptionController } from "@/adapters/controllers/admin/subscriptionController";
import { WallpaperRepository } from "@/adapters/repository/creator/wallpaperRepository";
import { GetAllWallpapersUseCase } from "@/application/useCases/admin/wallpaper/getAllWallpapersUseCase";
import { BlockWallpaperUseCase } from "@/application/useCases/admin/wallpaper/blockWallpaperUseCase";
import { UnblockWallpaperUseCase } from "@/application/useCases/admin/wallpaper/unblockWallpaperUseCase";
import { AdminWallpaperController } from "@/adapters/controllers/admin/adminWallpaperController";
import { WalletRepository } from "@/adapters/repository/walletRepository";
import { CreditWalletUseCase } from "@/application/useCases/wallet/creditWalletUseCase";
import { GetWalletUseCase } from "@/application/useCases/wallet/getWalletUseCase";
import { AdminWalletController } from "@/adapters/controllers/admin/adminWalletController";
import { DeleteSubscriptionUseCase } from "@/application/useCases/admin/deleteSubscriptionUseCase";
import { BookingRepository } from "@/adapters/repository/user/bookingRepository";
import { GetDashboardStatsUseCase } from "@/application/useCases/admin/getDashboardStatsUseCase";
import { GenerateDashboardReportUseCase } from "@/application/useCases/admin/GenerateDashboardReportUseCase";
import { DashboardReportGenerator } from "@/domain/services/admin/DashboardReportGenerator";
import { AdminDashboardController } from "@/adapters/controllers/admin/adminDashboardController";
import { ComplaintRepository } from "../../../adapters/repository/complaintRepository";

const userRepo = new UserRepository();
const creatorRepo = new CreatorRepository();
const categoryRepo = new CategoryRepository()
const subscriptionRepo = new SubscriptionRepository()
const walletRepo = new WalletRepository()
const bookingRepo = new BookingRepository();
const packageRepo = new PackageRepository();
const wallpaperRepo = new WallpaperRepository();
const complaintRepo = new ComplaintRepository();

const jwtService = new JwtServices();
const passwordService = new PasswordService();
const mailService = new MailService()
const reportGenerator = new DashboardReportGenerator();

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
const getAllWallpapersUseCase = new GetAllWallpapersUseCase(wallpaperRepo);
const blockWallpaperUseCase = new BlockWallpaperUseCase(wallpaperRepo);
const unblockWallpaperUseCase = new UnblockWallpaperUseCase(wallpaperRepo);
const getWalletUseCase = new GetWalletUseCase(walletRepo);
const creditWalletUseCase = new CreditWalletUseCase(walletRepo);
const getDashboardStatsUseCase = new GetDashboardStatsUseCase(userRepo, creatorRepo, bookingRepo, walletRepo, packageRepo, wallpaperRepo, complaintRepo);
const generateDashboardReportUseCase = new GenerateDashboardReportUseCase(getDashboardStatsUseCase, reportGenerator);

export const adminLoginController = new AdminLoginController(adminLoginUseCase);
export const adminUserController = new AdminUserController(adminUserlistingUseCase, toggleUserStatusUseCase);
export const adminCreatorController = new AdminCreatorController(approveCreatorUseCase, rejectCreatorUseCase, adminCreatorListingUseCase, toggleCreatorStatusUseCase);
export const categoryController = new CategoryController(addCategoryUseCase, editCategoryUseCase, deleteCategoryUseCase, adminCategoryListingUseCase);
export const subscriptionController = new SubscriptionController(addSubscriptionUseCase, editSubscriptionUseCase, deleteSubscriptionUseCase, getSubscriptionUseCase);
export const adminWallpaperController = new AdminWallpaperController(getAllWallpapersUseCase, blockWallpaperUseCase, unblockWallpaperUseCase);
export const adminWalletController = new AdminWalletController(getWalletUseCase, creditWalletUseCase);
export const adminDashboardController = new AdminDashboardController(getDashboardStatsUseCase, generateDashboardReportUseCase);

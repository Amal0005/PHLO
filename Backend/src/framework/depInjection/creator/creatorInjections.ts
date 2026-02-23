import { CreatorLoginController } from "@/adapters/controllers/creator/auth/creatorLoginController";
import { CreatorRegisterController } from "@/adapters/controllers/creator/auth/creatorRegisterController";
import { CreatorAuthController } from "@/adapters/controllers/creator/auth/authController";
import { CreatorRepository } from "@/adapters/repository/creator/creatorRepository";
import { UserRepository } from "@/adapters/repository/user/userRepository";
import { JwtServices } from "@/domain/services/user/jwtServices";
import { PasswordService } from "@/domain/services/user/passwordService";
import { RedisService } from "@/domain/services/user/redisServices";
import { OtpServices } from "@/domain/services/user/otpServices";
import { MailService } from "@/domain/services/user/mailServices";
import { CreatorLoginUseCase } from "@/application/useCases/creator/auth/creatorLoginUseCase";
import { RegisterCreatorUseCase } from "@/application/useCases/creator/auth/registerCreatorUseCase";
import { CheckCreatorExistsUseCase } from "@/application/useCases/creator/auth/checkCreatorExistsUseCase";
import { ForgotPasswordUseCase } from "@/application/useCases/creator/auth/forgotPasswordUseCase";
import { VerifyForgotOtpUseCase } from "@/application/useCases/creator/auth/verifyForgotOtpUseCase";
import { ResetPasswordUseCase } from "@/application/useCases/creator/auth/resetPasswordUseCase";
import { VerifyCreatorOtpUseCase } from "@/application/useCases/creator/auth/verifyCreatorOtpUseCase";
import { ResendCreatorOtpUseCase } from "@/application/useCases/creator/auth/resendCreatorOtpUseCase";
import { EditCreatorProfileUseCase } from "@/application/useCases/creator/profile/editCreatorProfileUseCase";
import { GetCreatorProfileUseCase } from "@/application/useCases/creator/profile/getCreatorProfileUseCase";
import { CreatorProfileController } from "@/adapters/controllers/creator/profile/creatorProfileController";
import { PackageRepository } from "@/adapters/repository/creator/packageRepository";
import { AddPackageUseCase } from "@/application/useCases/creator/package/addPackageUseCase";
import { GetPackagesUseCase } from "@/application/useCases/creator/package/getPackageUseCase";
import { EditPackageUseCase } from "@/application/useCases/creator/package/editPackageUseCase";
import { DeletePackageUseCase } from "@/application/useCases/creator/package/deletePackageUseCase";
import { PackageController } from "@/adapters/controllers/creator/package/packageController";
import { CategoryRepository } from "@/adapters/repository/admin/categoryRepository";
import { AdminCategoryListingUseCase } from "@/application/useCases/admin/adminCategoryListingUseCase";
import { AddCategoryUseCase } from "@/application/useCases/admin/addCategoryUseCase";
import { EditCategoryUseCase } from "@/application/useCases/admin/editCategoryUseCase";
import { DeleteCategoryUseCase } from "@/application/useCases/admin/deleteCategoryUseCase";
import { CategoryController } from "@/adapters/controllers/admin/category/categoryController";
import { BuySubscriptionUseCase } from "@/application/useCases/payment/buySubscriptionUseCase";
import { CreatorSubscriptionWebhookUseCase } from "@/application/useCases/payment/creatorSubscriptionWebhookUseCase";
import { SubscriptionRepository } from "@/adapters/repository/admin/subscriptionRepository";
import { StripeService } from "@/domain/services/stripeService";
import { CreatorSubscriptionController } from "@/adapters/controllers/subscription/creatorSubscriptionController";
import { GetSubscriptionUseCase } from "@/application/useCases/admin/getSubscriptionUseCase";
import { AddWallpaperUseCase } from "@/application/useCases/creator/wallpaper/addWallpaperUseCase";
import { WallpaperRepository } from "@/adapters/repository/creator/wallpaperRepository";
import { WallpaperController } from "@/adapters/controllers/creator/wallpaper/wallpaperController";

const creatorRepository = new CreatorRepository();
const userRepository = new UserRepository();
const packageRepository = new PackageRepository();
const categoryRepo = new CategoryRepository();
const subscriptionRepo = new SubscriptionRepository()
const wallpaperRepo = new WallpaperRepository()

const jwtService = new JwtServices();
const passwordService = new PasswordService();
const redisService = new RedisService();
const otpService = new OtpServices(redisService);
const mailService = new MailService();
const stripeService = new StripeService()

const creatorRegisterUseCase = new RegisterCreatorUseCase(creatorRepository, passwordService, userRepository, otpService, mailService, redisService);
const checkCreatorExistsUseCase = new CheckCreatorExistsUseCase(creatorRepository, userRepository);
const verifyCreatorOtpUseCase = new VerifyCreatorOtpUseCase(creatorRepository, otpService, redisService);
const resendCreatorOtpUseCase = new ResendCreatorOtpUseCase(otpService, mailService);
const creatorLoginUseCase = new CreatorLoginUseCase(creatorRepository, jwtService, passwordService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(creatorRepository, otpService, mailService);
const verifyForgotOtpUseCase = new VerifyForgotOtpUseCase(otpService, redisService);
const resetPasswordUseCase = new ResetPasswordUseCase(creatorRepository, passwordService, redisService);
const getCreatorProfileUseCase = new GetCreatorProfileUseCase(creatorRepository)
const editCreatorProfileUseCase = new EditCreatorProfileUseCase(creatorRepository)
const addPackageUseCase = new AddPackageUseCase(packageRepository, creatorRepository)
const getPackageUseCase = new GetPackagesUseCase(packageRepository)
const editPackageUseCase = new EditPackageUseCase(packageRepository)
const deletePackageUseCase = new DeletePackageUseCase(packageRepository)
const adminCategoryListingUseCase = new AdminCategoryListingUseCase(categoryRepo);
const addCategoryUseCase = new AddCategoryUseCase(categoryRepo);
const editCategoryUseCase = new EditCategoryUseCase(categoryRepo);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo);
const buySubscriptionUseCase = new BuySubscriptionUseCase(subscriptionRepo, stripeService)
const getSubscriptionUseCase = new GetSubscriptionUseCase(subscriptionRepo);
const addWallpaperUseCase= new AddWallpaperUseCase(wallpaperRepo,creatorRepository) 

export const creatorRegisterController = new CreatorRegisterController(creatorRegisterUseCase, checkCreatorExistsUseCase, verifyCreatorOtpUseCase, resendCreatorOtpUseCase);
export const creatorLoginController = new CreatorLoginController(creatorLoginUseCase);
export const creatorAuthController = new CreatorAuthController(forgotPasswordUseCase, verifyForgotOtpUseCase, resetPasswordUseCase);
export const creatorProfileController = new CreatorProfileController(getCreatorProfileUseCase, editCreatorProfileUseCase)
export const packageController = new PackageController(addPackageUseCase, deletePackageUseCase, editPackageUseCase, getPackageUseCase);
export const getCategoryController = new CategoryController(addCategoryUseCase, editCategoryUseCase, deleteCategoryUseCase, adminCategoryListingUseCase);
export const creatorSubscriptionController = new CreatorSubscriptionController(buySubscriptionUseCase, getSubscriptionUseCase)
export const wallpaperController = new WallpaperController(addWallpaperUseCase)


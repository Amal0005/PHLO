import { TokenController } from "../../../adapters/controllers/tokenController";
import { LogoutController } from "../../../adapters/controllers/logoutController";
import { UserAuthController } from "../../../adapters/controllers/user/auth/authController";
import { GoogleAuthController } from "../../../adapters/controllers/user/auth/googleAuthController";
import { userLoginController } from "../../../adapters/controllers/user/auth/userLoginController";
import { userRegisterController } from "../../../adapters/controllers/user/auth/userRegisterController";
import { CreatorRepository } from "../../../adapters/repository/creator/creatorRepository";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { TokenBlacklistService } from "../../../domain/services/tokenBlacklistService";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { MailService } from "../../../domain/services/user/mailServices";
import { OtpServices } from "../../../domain/services/user/otpServices";
import { PasswordService } from "../../../domain/services/user/passwordService";
import { PendingUserService } from "../../../domain/services/user/pedingUserService";
import { RedisService } from "../../../domain/services/user/redisServices";
import { UserProfileController } from "@/adapters/controllers/user/profile/userProfileController";
import { CategoryRepository } from "@/adapters/repository/admin/categoryRepository";
import { AdminCategoryListingUseCase } from "@/application/useCases/admin/adminCategoryListingUseCase";
import { AddCategoryUseCase } from "@/application/useCases/admin/addCategoryUseCase";
import { EditCategoryUseCase } from "@/application/useCases/admin/editCategoryUseCase";
import { DeleteCategoryUseCase } from "@/application/useCases/admin/deleteCategoryUseCase";
import { CategoryController } from "@/adapters/controllers/admin/category/categoryController";
import { LogoutUseCase } from "../../../application/useCases/logoutUseCase";
import { ForgotPasswordUseCase } from "../../../application/useCases/user/auth/forgotPasswordUseCase";
import { GoogleLoginUseCase } from "../../../application/useCases/user/auth/googleLoginUseCase";
import { ResendOtpUseCase } from "../../../application/useCases/user/auth/resendOtpUseCase";
import { ResetPasswordUseCase } from "../../../application/useCases/user/auth/resetPasswordUseCase";
import { VerifyForgotOtpUseCase } from "../../../application/useCases/user/auth/verifyForgotOtpUseCase";
import { userLoginUserUseCase } from "../../../application/useCases/user/auth/loginUserUseCase";
import { userRegisterUseCase } from "../../../application/useCases/user/auth/registerUserUseCase";
import { verifyRegisterOtpUseCase } from "../../../application/useCases/user/auth/verifyRegisterOtpUseCase";
import { GetUserProfileUseCase } from "@/application/useCases/user/profile/getUserProfileUseCase";
import { GetProfileController } from "@/adapters/controllers/user/profile/getProfileController";
import { EditProfileController } from "@/adapters/controllers/user/profile/editProfileController";
import { ChangePasswordController } from "@/adapters/controllers/user/profile/changePasswordController";
import { EditUserProfileUsecase } from "@/application/useCases/user/profile/editUserProfileUseCase";
import { ChangePasswordUseCase } from "@/application/useCases/user/profile/changePasswordUseCase";
import { ListUserPackagesUseCase } from "@/application/useCases/user/package/listUserPackagesUseCase";
import { ListUserPackagesController } from "@/adapters/controllers/user/package/listUserPackagesController";
import { PackageRepository } from "@/adapters/repository/creator/packageRepository";
import { GetPackageDetailUseCase } from "@/application/useCases/user/package/getPackageDetailUseCase";
import { GetPackageDetailController } from "@/adapters/controllers/user/package/getPackageDetailController";
import { BookingRepository } from "@/adapters/repository/user/bookingRepository";
import { SubscriptionRepository } from "@/adapters/repository/admin/subscriptionRepository";
import { StripeService } from "@/domain/services/stripeService";
import { CreateBookingUseCase } from "@/application/useCases/user/booking/createBookingUseCase";
import { BookingController } from "@/adapters/controllers/booking/bookingController";
import { BookingWebhookUseCase } from "@/application/useCases/user/booking/bookingWebhookUseCase";
import { CreatorSubscriptionWebhookUseCase } from "@/application/useCases/payment/creatorSubscriptionWebhookUseCase";
import { ListBookingUseCase } from "@/application/useCases/user/booking/listbookingUseCase";
import { GetApprovedWallpaperUseCase } from "@/application/useCases/user/wallpaper/getApprovedWallpaperUseCase";
import { WallpaperRepository } from "@/adapters/repository/creator/wallpaperRepository";
import { UserWallpaperController } from "@/adapters/controllers/user/userWallpaperController";
import { RecordDownloadUseCase } from "@/application/useCases/creator/wallpaper/recordDownloadUseCase";
import { WallpaperDownloadRepository } from "@/adapters/repository/creator/wallpaperDownloadRepository";

const userRepo = new UserRepository();
const passwordServices = new PasswordService();
const redisService = new RedisService()
const otpServices = new OtpServices(redisService)
const pendingService = new PendingUserService(redisService)
const jwtService = new JwtServices()
const mailService = new MailService()
const tokenBlacklistService = new TokenBlacklistService(redisService)
const creatorRepository = new CreatorRepository()
const packageRepository = new PackageRepository()
const categoryRepository = new CategoryRepository();
const bookingRepo = new BookingRepository()
const subscriptionRepo = new SubscriptionRepository()
const wallpaperRepo = new WallpaperRepository()
const stripeService = new StripeService()
const wallpaperDownloadRepo = new WallpaperDownloadRepository()

const registerUseCase = new userRegisterUseCase(userRepo, creatorRepository, passwordServices, otpServices, mailService, redisService);
const loginUseCase = new userLoginUserUseCase(userRepo, passwordServices, jwtService);
const verifyOtpUseCase = new verifyRegisterOtpUseCase(userRepo, otpServices, pendingService)
const resendOtpUsecase = new ResendOtpUseCase(otpServices, mailService)
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepo, otpServices, mailService)
const verifyForgotOtpUseCase = new VerifyForgotOtpUseCase(otpServices, redisService)
const resetPasswordUseCase = new ResetPasswordUseCase(userRepo, passwordServices, redisService)
const googleLoginUseCase = new GoogleLoginUseCase(userRepo, jwtService)
const logoutUseCase = new LogoutUseCase(tokenBlacklistService)
const getUserProfileUseCase = new GetUserProfileUseCase(userRepo)
const editUserProfileUseCase = new EditUserProfileUsecase(userRepo, creatorRepository)
const changePasswordUseCase = new ChangePasswordUseCase(userRepo, passwordServices)
const listUserPackagesUseCase = new ListUserPackagesUseCase(packageRepository)
const getPackageDetailUseCase = new GetPackageDetailUseCase(packageRepository);
const adminCategoryListingUseCase = new AdminCategoryListingUseCase(categoryRepository);
const addCategoryUseCase = new AddCategoryUseCase(categoryRepository);
const editCategoryUseCase = new EditCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
const createBookingUseCase = new CreateBookingUseCase(bookingRepo, packageRepository, stripeService)
const bookingWebhookUseCase = new BookingWebhookUseCase(bookingRepo, stripeService)
const creatorSubscriptionWebhookUseCase = new CreatorSubscriptionWebhookUseCase(creatorRepository, subscriptionRepo, stripeService)
const listBookingsUseCase = new ListBookingUseCase(bookingRepo);
const getApprovedWallpapers = new GetApprovedWallpaperUseCase(wallpaperRepo)
const recordDownloadUseCase = new RecordDownloadUseCase(wallpaperDownloadRepo)



export const registerController = new userRegisterController(registerUseCase, verifyOtpUseCase, resendOtpUsecase);
export const loginController = new userLoginController(loginUseCase);
export const userAuthController = new UserAuthController(forgotPasswordUseCase, verifyForgotOtpUseCase, resetPasswordUseCase)
export const userGoogleController = new GoogleAuthController(googleLoginUseCase)
export const logoutController = new LogoutController(logoutUseCase)
export const tokenController = new TokenController(jwtService)
export const getProfileController = new GetProfileController(getUserProfileUseCase)
export const editProfileController = new EditProfileController(editUserProfileUseCase)
export const changePasswordController = new ChangePasswordController(changePasswordUseCase)
export const listUserPackagesController = new ListUserPackagesController(listUserPackagesUseCase)
export const getPackageDetailController = new GetPackageDetailController(getPackageDetailUseCase)
export const getCategoryController = new CategoryController(addCategoryUseCase, editCategoryUseCase, deleteCategoryUseCase, adminCategoryListingUseCase);
export const userProfileController = new UserProfileController(getUserProfileUseCase, editUserProfileUseCase, changePasswordUseCase, otpServices, userRepo, creatorRepository);
export const bookingController = new BookingController(createBookingUseCase, bookingWebhookUseCase, listBookingsUseCase, creatorSubscriptionWebhookUseCase, stripeService)
export const userWallpaperController = new UserWallpaperController(getApprovedWallpapers, recordDownloadUseCase)

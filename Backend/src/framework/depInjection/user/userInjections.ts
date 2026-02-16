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

const userRepo = new UserRepository();
const passwordServices = new PasswordService();
const redisService = new RedisService()
const otpServices = new OtpServices(redisService)
const pendingService = new PendingUserService(redisService)
const jwtService = new JwtServices()
const mailService = new MailService()
const tokenBlacklistService = new TokenBlacklistService(redisService)
const creatorRepository = new CreatorRepository()
const packageRepository=new PackageRepository()


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
const listUserPackagesUseCase=new ListUserPackagesUseCase(packageRepository)
const getPackageDetailUseCase = new GetPackageDetailUseCase(packageRepository);


export const registerController = new userRegisterController(registerUseCase, verifyOtpUseCase, resendOtpUsecase);
export const loginController = new userLoginController(loginUseCase);
export const userAuthController = new UserAuthController(forgotPasswordUseCase, verifyForgotOtpUseCase, resetPasswordUseCase)
export const userGoogleController = new GoogleAuthController(googleLoginUseCase)
export const logoutController = new LogoutController(logoutUseCase)
export const tokenController = new TokenController(jwtService)
export const getProfileController = new GetProfileController(getUserProfileUseCase)
export const editProfileController = new EditProfileController(editUserProfileUseCase)
export const changePasswordController = new ChangePasswordController(changePasswordUseCase)
export const listUserPackagesController=new ListUserPackagesController(listUserPackagesUseCase)
export const getPackageDetailController=new GetPackageDetailController(getPackageDetailUseCase)

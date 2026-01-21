import { LogoutController } from "../../../adapters/controllers/logoutController";
import { UserAuthController } from "../../../adapters/controllers/user/auth/authController";
import { GoogleAuthController } from "../../../adapters/controllers/user/auth/googleAuthController";
import { userLoginController } from "../../../adapters/controllers/user/login/userLoginController";
import { userRegisterController } from "../../../adapters/controllers/user/register/userRegisterController";
import { userRepository } from "../../../adapters/repository/user/userRepository";
import { TokenBlacklistService } from "../../../domain/services/tokenBlacklistService";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { MailService } from "../../../domain/services/user/mailServices";
import { OtpServices } from "../../../domain/services/user/otpServices";
import { PasswordService } from "../../../domain/services/user/passwordService";
import { PendingUserService } from "../../../domain/services/user/pedingUserService";
import { RedisService } from "../../../domain/services/user/redisServices";
import { LogoutUseCase } from "../../../useCases/logoutUseCase";
import { ForgotPasswordUseCase } from "../../../useCases/user/auth/forgotPasswordUseCase";
import { GoogleLoginUseCase } from "../../../useCases/user/auth/googleLoginUseCase";
import { ResendOtpUseCase } from "../../../useCases/user/auth/resendOtpUseCase";
import { ResetPasswordUseCase } from "../../../useCases/user/auth/resetPasswordUseCase";
import { VerifyForgotOtpUseCase } from "../../../useCases/user/auth/verifyForgotOtpUseCase";
import { userLoginUserUseCase } from "../../../useCases/user/login/loginUserUseCase";
import { userRegisterUseCase } from "../../../useCases/user/register/registerUserUseCase";
import { verifyRegisterOtpUseCase } from "../../../useCases/user/register/verifyRegisterOtpUseCase";

const userRepo = new userRepository();
const passwordServices = new PasswordService();
const otpServices=new OtpServices()
const pendingService=new PendingUserService()
const jwtService=new JwtServices()
const mailService=new MailService()
const redisService=new RedisService()
const tokenBlacklistService=new TokenBlacklistService(redisService)


const registerUseCase = new userRegisterUseCase(userRepo,passwordServices,otpServices,mailService);
const loginUseCase = new userLoginUserUseCase(userRepo, passwordServices,jwtService);
const verifyOtpUseCase=new verifyRegisterOtpUseCase(userRepo,otpServices,pendingService)
const resendOtpUsecase=new ResendOtpUseCase(otpServices,mailService)
const forgotPasswordUseCase=new ForgotPasswordUseCase(userRepo,otpServices,mailService)
const verifyForgotOtpUseCase=new VerifyForgotOtpUseCase(otpServices)
const resetPasswordUseCase=new ResetPasswordUseCase(userRepo,passwordServices)
const googleLoginUseCase=new GoogleLoginUseCase(userRepo,jwtService)
const logoutUseCase=new LogoutUseCase(tokenBlacklistService)

export const registerController = new userRegisterController(registerUseCase,verifyOtpUseCase,resendOtpUsecase);
export const loginController = new userLoginController(loginUseCase);
export const userAuthController=new UserAuthController(forgotPasswordUseCase,verifyForgotOtpUseCase,resetPasswordUseCase)
export const userGoogleController=new GoogleAuthController(googleLoginUseCase)
export const logoutController =new LogoutController(logoutUseCase)
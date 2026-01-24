import { CreatorLoginController } from "@/adapters/controllers/creator/login/creatorLoginController";
import { CreatorRegisterController } from "@/adapters/controllers/creator/register/creatorRegisterController";
import { CreatorAuthController } from "@/adapters/controllers/creator/auth/authController";
import { CreatorRepository } from "@/adapters/repository/creator/creatorRepository";
import { UserRepository } from "@/adapters/repository/user/userRepository";
import { JwtServices } from "@/domain/services/user/jwtServices";
import { PasswordService } from "@/domain/services/user/passwordService";
import { OtpServices } from "@/domain/services/user/otpServices";
import { MailService } from "@/domain/services/user/mailServices";
import { CreatorLoginUseCase } from "@/useCases/creator/login/creatorLoginUseCase";
import { RegisterCreatorUseCase } from "@/useCases/creator/register/registerCreatorUseCase";
import { ForgotPasswordUseCase } from "@/useCases/creator/auth/forgotPasswordUseCase";
import { VerifyForgotOtpUseCase } from "@/useCases/creator/auth/verifyForgotOtpUseCase";
import { ResetPasswordUseCase } from "@/useCases/creator/auth/resetPasswordUseCase";

const creatorRepository = new CreatorRepository();
const jwtService = new JwtServices();
const passwordService = new PasswordService();
const userRepository = new UserRepository();
const otpService = new OtpServices();
const mailService = new MailService();

const creatorRegisterUseCase = new RegisterCreatorUseCase(creatorRepository,passwordService,userRepository);
const creatorLoginUseCase = new CreatorLoginUseCase(creatorRepository,jwtService,passwordService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(creatorRepository,otpService,mailService);
const verifyForgotOtpUseCase = new VerifyForgotOtpUseCase(otpService);
const resetPasswordUseCase = new ResetPasswordUseCase(creatorRepository,passwordService);

export const creatorRegisterController = new CreatorRegisterController(creatorRegisterUseCase);
export const creatorLoginController = new CreatorLoginController(creatorLoginUseCase);
export const creatorAuthController = new CreatorAuthController(forgotPasswordUseCase,verifyForgotOtpUseCase,resetPasswordUseCase,);

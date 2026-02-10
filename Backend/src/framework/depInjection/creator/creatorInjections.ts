import { CreatorLoginController } from "@/adapters/controllers/creator/login/creatorLoginController";
import { CreatorRegisterController } from "@/adapters/controllers/creator/register/creatorRegisterController";
import { CreatorAuthController } from "@/adapters/controllers/creator/auth/authController";
import { CreatorRepository } from "@/adapters/repository/creator/creatorRepository";
import { UserRepository } from "@/adapters/repository/user/userRepository";
import { JwtServices } from "@/domain/services/user/jwtServices";
import { PasswordService } from "@/domain/services/user/passwordService";
import { RedisService } from "@/domain/services/user/redisServices";
import { OtpServices } from "@/domain/services/user/otpServices";
import { MailService } from "@/domain/services/user/mailServices";
import { CreatorLoginUseCase } from "@/useCases/creator/login/creatorLoginUseCase";
import { RegisterCreatorUseCase } from "@/useCases/creator/register/registerCreatorUseCase";
import { CheckCreatorExistsUseCase } from "@/useCases/creator/register/checkCreatorExistsUseCase";
import { ForgotPasswordUseCase } from "@/useCases/creator/auth/forgotPasswordUseCase";
import { VerifyForgotOtpUseCase } from "@/useCases/creator/auth/verifyForgotOtpUseCase";
import { ResetPasswordUseCase } from "@/useCases/creator/auth/resetPasswordUseCase";
import { VerifyCreatorOtpUseCase } from "@/useCases/creator/register/verifyCreatorOtpUseCase";
import { ResendCreatorOtpUseCase } from "@/useCases/creator/register/resendCreatorOtpUseCase";
import { EditCreatorProfileUseCase } from "@/useCases/creator/profile/editCreatorProfileUseCase";
import { GetCreatorProfileUseCase } from "@/useCases/creator/profile/getCreatorProfileUseCase";
import { CreatorProfileController } from "@/adapters/controllers/creator/profile/creatorProfileController";
import { PackageRepository } from "@/adapters/repository/creator/packageRepository";
import { AddPackageUseCase } from "@/useCases/creator/package/addPackageUseCase";
import { CreatorPackageController } from "@/adapters/controllers/creator/creatorPackageController";
import { GetPackagesUseCase } from "@/useCases/creator/package/getPackageUseCase";

const creatorRepository = new CreatorRepository();
const userRepository = new UserRepository();
const packageRepository=new PackageRepository()
const jwtService = new JwtServices();
const passwordService = new PasswordService();
const redisService = new RedisService();
const otpService = new OtpServices(redisService);
const mailService = new MailService();

const creatorRegisterUseCase = new RegisterCreatorUseCase(creatorRepository, passwordService, userRepository, otpService, mailService, redisService);
const checkCreatorExistsUseCase = new CheckCreatorExistsUseCase(creatorRepository, userRepository);
const verifyCreatorOtpUseCase = new VerifyCreatorOtpUseCase(creatorRepository, otpService, redisService);
const resendCreatorOtpUseCase = new ResendCreatorOtpUseCase(otpService, mailService);
const creatorLoginUseCase = new CreatorLoginUseCase(creatorRepository, jwtService, passwordService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(creatorRepository, otpService, mailService);
const verifyForgotOtpUseCase = new VerifyForgotOtpUseCase(otpService, redisService);
const resetPasswordUseCase = new ResetPasswordUseCase(creatorRepository, passwordService, redisService);
const getCreatorProfileUseCase= new GetCreatorProfileUseCase(creatorRepository)
const editCreatorProfileUseCase= new EditCreatorProfileUseCase(creatorRepository)
const addPackageUseCase=new AddPackageUseCase(packageRepository)
const getPackageUseCase=new GetPackagesUseCase(packageRepository)

export const creatorRegisterController = new CreatorRegisterController(creatorRegisterUseCase,checkCreatorExistsUseCase,verifyCreatorOtpUseCase,resendCreatorOtpUseCase);
export const creatorLoginController = new CreatorLoginController(creatorLoginUseCase);
export const creatorAuthController = new CreatorAuthController(forgotPasswordUseCase, verifyForgotOtpUseCase, resetPasswordUseCase);
export const creatorProfileController=new CreatorProfileController(getCreatorProfileUseCase,editCreatorProfileUseCase)
export const creatorPackageController=new CreatorPackageController(addPackageUseCase,getPackageUseCase)


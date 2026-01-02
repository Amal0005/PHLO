import { userLoginController } from "../../../adapters/controllers/user/login/userLoginController";
import { userRegisterController } from "../../../adapters/controllers/user/register/userRegisterController";
import { userRepository } from "../../../adapters/repository/user/userRepository";
import { OtpServices } from "../../../domain/services/user/otpServices";
import { passwordService } from "../../../domain/services/user/passwordService";
import { userLoginUserUseCase } from "../../../useCases/user/login/loginUserUseCase";
import { userRegisterUseCase } from "../../../useCases/user/register/registerUserUseCase";
import { verifyRegisterOtpUseCase } from "../../../useCases/user/register/verifyRegisterOtpUseCase";

const userRepo = new userRepository();
const passwordServices = new passwordService();
const otpServices=new OtpServices()

const registerUseCase = new userRegisterUseCase(userRepo,passwordServices,otpServices);
const loginUseCase = new userLoginUserUseCase(userRepo, passwordServices);
const verifyOtpUseCase=new verifyRegisterOtpUseCase(userRepo,otpServices)

export const registerController = new userRegisterController(registerUseCase,verifyOtpUseCase);
export const loginController = new userLoginController(loginUseCase);

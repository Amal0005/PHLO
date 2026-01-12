import { CreatorLoginController } from "../../../adapters/controllers/creator/login/creatorLoginController";
import { CreatorRegisterController } from "../../../adapters/controllers/creator/register/creatorRegisterController";
import { CreatorRepository } from "../../../adapters/repository/creator/creatorRepository";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { PasswordService } from "../../../domain/services/user/passwordService";
import { CreatorLoginUseCase } from "../../../useCases/creator/login/creatorLoginUseCase";
import { RegisterCreatorUseCase } from "../../../useCases/creator/register/registerCreatorUseCase";

const creatorRepository=new CreatorRepository
const jwtService=new JwtServices
const passwordService=new PasswordService

const creatorRegisterUseCase=new RegisterCreatorUseCase(creatorRepository,passwordService)
const creatorLoginUseCase=new CreatorLoginUseCase(creatorRepository,jwtService,passwordService)

export const creatorRegisterController=new CreatorRegisterController(creatorRegisterUseCase)
export const creatorLoginController=new CreatorLoginController(creatorLoginUseCase)

import { CreatorRegisterController } from "../../../adapters/controllers/creator/register/creatorRegisterController";
import { CreatorRepository } from "../../../adapters/repository/creator/creatorRepository";
import { RegisterCreatorUseCase } from "../../../useCases/creator/register/registerCreatorUseCase";

const creatorRepository=new CreatorRepository


const creatorRegisterUseCase=new RegisterCreatorUseCase(creatorRepository)

export const creatorRegisterController=new CreatorRegisterController(creatorRegisterUseCase)

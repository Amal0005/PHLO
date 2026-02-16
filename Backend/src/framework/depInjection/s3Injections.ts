
import { UploadController } from "@/adapters/controllers/user/s3/uploaderController";
import { ViewController } from "@/adapters/controllers/user/s3/viewController";
import { CreatorRepository } from "@/adapters/repository/creator/creatorRepository";
import { S3StorageService } from "@/domain/services/s3Services";
import { GetPresignedViewUrlUseCase } from "@/application/useCases/getPresignedViewUrlUseCase";
import { GetPresignedUploadUrlUseCase } from "@/application/useCases/getUrlUseCase";


const storageService=new S3StorageService
const createRepository=new CreatorRepository


const getPresignedurlUseCase=new GetPresignedUploadUrlUseCase(storageService)
const getPresignedViewUrlUseCase=new GetPresignedViewUrlUseCase(storageService)

export const uploadController=new UploadController(getPresignedurlUseCase,getPresignedViewUrlUseCase)
export const viewController=new ViewController(createRepository,getPresignedViewUrlUseCase)
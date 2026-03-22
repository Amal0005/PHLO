import { UploadController } from "@/adapters/controllers/s3/uploaderController";
import { ViewController } from "@/adapters/controllers/s3/viewController";
import { CreatorRepository } from "@/adapters/repository/creator/creatorRepository";
import { S3StorageService } from "@/domain/services/s3Services";
import { GetPresignedViewUrlUseCase } from "@/application/useCases/getPresignedViewUrlUseCase";
import { GetPresignedUploadUrlUseCase } from "@/application/useCases/getUrlUseCase";
import { GetCreatorImagesUseCase } from "@/application/useCases/creator/GetCreatorImagesUseCase";


export const storageService=new S3StorageService
const createRepository=new CreatorRepository


const getPresignedurlUseCase=new GetPresignedUploadUrlUseCase(storageService)
const getPresignedViewUrlUseCase=new GetPresignedViewUrlUseCase(storageService)
const getCreatorImagesUseCase = new GetCreatorImagesUseCase(createRepository, getPresignedViewUrlUseCase);

export const uploadController=new UploadController(getPresignedurlUseCase,getPresignedViewUrlUseCase)
export const viewController=new ViewController(getCreatorImagesUseCase)
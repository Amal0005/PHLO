import { IGetPresignedUrlUseCase } from "@/domain/interface/creator/IgetUrl";
import { IStorageService } from "@/domain/interface/service/Is3Services";


export class GetPresignedUploadUrlUseCase implements IGetPresignedUrlUseCase{
    constructor(private _storageservice:IStorageService){}
    async execute(fileType: string, folder: string): Promise<{ uploadUrl: string; publicUrl: string; }> {
        return this._storageservice.getPresignedUploadUrl(fileType,folder)
    }
} 
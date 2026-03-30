import type { IGetPresignedViewUrlUseCase } from "@/domain/interface/creator/IGetPresignedViewUrlUseCase";
import type { IStorageService } from "@/domain/interface/service/IS3Services";


export class GetPresignedViewUrlUseCase implements IGetPresignedViewUrlUseCase {

  constructor(private _storageService: IStorageService) {}

  async execute(key: string): Promise<string> {
    return this._storageService.getSignedViewUrl(key);
  }
}


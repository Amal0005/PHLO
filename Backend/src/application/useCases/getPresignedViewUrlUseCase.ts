import type { IGetPresignedViewUrlUseCase } from "@/domain/interfaces/creator/IGetPresignedViewUrlUseCase";
import type { IStorageService } from "@/domain/interfaces/service/IS3Services";


export class GetPresignedViewUrlUseCase implements IGetPresignedViewUrlUseCase {

  constructor(private _storageService: IStorageService) {}

  async execute(key: string): Promise<string> {
    return this._storageService.getSignedViewUrl(key);
  }
}


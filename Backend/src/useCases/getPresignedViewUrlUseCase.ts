import { IGetPresignedViewUrlUseCase } from "../domain/interface/creator/IgetPresignedViewUrlUseCase";
import { IStorageService } from "../domain/interface/service/Is3Services";

export class GetPresignedViewUrlUseCase implements IGetPresignedViewUrlUseCase {

  constructor(private _storageService: IStorageService) {}

  async execute(key: string): Promise<string> {
    return this._storageService.getSignedViewUrl(key);
  }
}

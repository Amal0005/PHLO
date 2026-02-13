import { IAddPackageUseCase } from "@/domain/interface/creator/package/IaddPackageUseCase";
import { IgetPackagesUseCase } from "@/domain/interface/creator/package/IgetPackageUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";

export class CreatorPackageController {
  constructor(
    private _addPackageUseCase: IAddPackageUseCase,
    private _getPackagesUseCase: IgetPackagesUseCase
  ) { }
  async addPackage(req: Request, res: Response) {
    try {
      const creatorId = (req as any).user?.userId;
      const packageData = { ...req.body, creatorId };
      const result = await this._addPackageUseCase.addPackage(packageData);
      res.status(StatusCode.CREATED).json({ success: true, data: result });
    } catch (error: any) {
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }
  async getPackages(req: Request, res: Response) {
    try {
      const creatorId = (req as any).user?.userId;
      if (!creatorId) {
        return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
      }
      const packages = await this._getPackagesUseCase.getPackage(creatorId);
      res.status(StatusCode.OK).json({ success: true, data: packages });
    } catch (error: any) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }
}


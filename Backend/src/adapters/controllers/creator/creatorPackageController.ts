import { IaddPackageUseCase } from "@/domain/interface/creator/package/IaddPackageUseCase";
import { IgetPackagesUseCase } from "@/domain/interface/creator/package/IgetPackageUseCase";
import { Request, Response } from "express";

export class CreatorPackageController {
  constructor(
    private _addPackageUseCase: IaddPackageUseCase,
    private _getPackagesUseCase:IgetPackagesUseCase
  ) {}
  async addPackage(req: Request, res: Response) {
    try {
      const creatorId = (req as any).user?.userId;
      const packageData = { ...req.body, creatorId };
      const result = await this._addPackageUseCase.addPackage(packageData);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async getPackages(req: Request, res: Response) {
    try {
      const creatorId = (req as any).user?.userId;
      if (!creatorId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const packages = await this._getPackagesUseCase.getPackage(creatorId);
      res.status(200).json({ success: true, data: packages });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

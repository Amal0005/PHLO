import { IaddPackageUseCase } from "@/domain/interface/creator/package/IaddPackageUseCase";
import { Request, Response } from "express";

export class CreatorPackageController {
  constructor(private addPackageUseCase: IaddPackageUseCase) {}
  async addPackage(req: Request, res: Response) {
    try {
      const creatorId = (req as any).user?.userId;
      const packageData = { ...req.body, creatorId };
      const result = await this.addPackageUseCase.addPackage(packageData);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

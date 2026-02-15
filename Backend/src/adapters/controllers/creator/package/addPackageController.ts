import { IAddPackageUseCase } from "@/domain/interface/creator/package/IAddPackageUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class AddPackageController {
    constructor(private _addPackageUseCase: IAddPackageUseCase) { }

    async addPackage(req: Request, res: Response) {
        try {
            const creatorId = (req as any).user?.userId;
            const packageData = { ...req.body, creatorId };

            const result = await this._addPackageUseCase.addPackage(packageData);
            res.status(StatusCode.CREATED).json({ success: true, data: result });
        } catch (error: any) {
            console.error("Error", error.message);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}

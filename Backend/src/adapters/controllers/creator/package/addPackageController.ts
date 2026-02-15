import { IAddPackageUseCase } from "@/domain/interface/creator/package/IAddPackageUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class AddPackageController {
    constructor(private _addPackageUseCase: IAddPackageUseCase) { }

    async addPackage(req: Request, res: Response) {
        try {
            console.log('🎯 Controller - Received request body:', JSON.stringify(req.body, null, 2));
            console.log('🎯 Controller - Location in request:', req.body.location);

            const creatorId = (req as any).user?.userId;
            const packageData = { ...req.body, creatorId };

            console.log('🎯 Controller - Package data with creatorId:', JSON.stringify(packageData, null, 2));
            console.log('🎯 Controller - Location in packageData:', packageData.location);

            const result = await this._addPackageUseCase.addPackage(packageData);
            res.status(StatusCode.CREATED).json({ success: true, data: result });
        } catch (error: any) {
            console.error('❌ Controller - Error:', error.message);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}

import { IAddPackageUseCase } from "@/domain/interface/creator/package/IAddPackageUseCase";
import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { MESSAGES } from "@/utils/commonMessages";

export class AddPackageController {
    constructor(private _addPackageUseCase: IAddPackageUseCase) { }

    async addPackage(req: AuthRequest, res: Response) {
        try {
            const creatorId = req.user?.userId;
            if (!creatorId) {
                return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
            }
            const packageData = { ...req.body, creatorId };

            const result = await this._addPackageUseCase.addPackage(packageData);
            res.status(StatusCode.CREATED).json({ success: true, data: result });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
        }
    }
}

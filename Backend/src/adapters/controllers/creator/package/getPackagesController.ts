import { IgetPackagesUseCase } from "@/domain/interface/creator/package/IGetPackageUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";

export class GetPackagesController {
    constructor(private _getPackagesUseCase: IgetPackagesUseCase) { }

    async execute(req: Request, res: Response) {
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

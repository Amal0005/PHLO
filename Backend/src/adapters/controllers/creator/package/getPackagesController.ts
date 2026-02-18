import { IgetPackagesUseCase } from "@/domain/interface/creator/package/IGetPackageUseCase";
import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";

export class GetPackagesController {
    constructor(private _getPackagesUseCase: IgetPackagesUseCase) { }

    async getPackage(req: AuthRequest, res: Response) {
        try {
            const creatorId = req.user?.userId;
            if (!creatorId) {
                return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const sortBy = req.query.sortBy as string;

            const packages = await this._getPackagesUseCase.getPackage(creatorId, page, limit, search, sortBy);
            res.status(StatusCode.OK).json({
                success: true,
                data: packages.data,
                total: packages.total,
                page: packages.page,
                limit: packages.limit,
                totalPages: packages.totalPages
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message });
        }
    }
}

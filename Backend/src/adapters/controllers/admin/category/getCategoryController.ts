import { IAdminCategoryListingUseCase } from "@/domain/interface/admin/IAdminCategoryListingUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";

export class GetCategoryController {
    constructor(private _adminCategoryListingUseCase: IAdminCategoryListingUseCase) { }

    async execute(req: Request, res: Response) {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(50, Number(req.query.limit) || 10);
            const { search, sort } = req.query;

            const data = await this._adminCategoryListingUseCase.getAllCategories(page, limit, {
                search: search as string,
                sort: sort as 'newest' | 'oldest'
            });

            return res.status(StatusCode.OK).json({
                success: true,
                ...data,
            });
        } catch (error) {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
            });
        }
    }
}

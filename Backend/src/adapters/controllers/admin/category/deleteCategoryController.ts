import { IDeleteCategoryUseCase } from "@/domain/interface/admin/IDeleteCategoryUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class DeleteCategoryController {
    constructor(private _deleteCategoryUseCase: IDeleteCategoryUseCase) { }

    async execute(req: Request, res: Response) {
        try {
            const { categoryId } = req.params;
            await this._deleteCategoryUseCase.delete(categoryId);
            res
                .status(StatusCode.OK)
                .json({ success: true, message: "Category deleted successfully" });
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
}

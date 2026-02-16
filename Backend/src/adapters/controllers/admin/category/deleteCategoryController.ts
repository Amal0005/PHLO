import { IDeleteCategoryUseCase } from "@/domain/interface/admin/IDeleteCategoryUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AppError } from "@/domain/errors/appError";

export class DeleteCategoryController {
    constructor(private _deleteCategoryUseCase: IDeleteCategoryUseCase) { }

    async deleteCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { categoryId } = req.params;
            await this._deleteCategoryUseCase.delete(categoryId);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "Category deleted successfully" });
        } catch (error: unknown) {
            const statusCode = error instanceof AppError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to delete category"
            });
        }
    }
}

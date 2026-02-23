import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AppError } from "@/domain/errors/appError";
import { MESSAGES } from "@/utils/commonMessages";
import { IAddCategoryUseCase } from "@/domain/interface/admin/IAddCategoryUseCase";
import { IEditCategoryUseCase } from "@/domain/interface/admin/IEditCategoryUseCase";
import { IDeleteCategoryUseCase } from "@/domain/interface/admin/IDeleteCategoryUseCase";
import { IAdminCategoryListingUseCase } from "@/domain/interface/admin/IAdminCategoryListingUseCase";

interface CategoryRequestBody {
    name: string;
    description?: string;
}

export class CategoryController {
    constructor(
        private _addCategoryUseCase: IAddCategoryUseCase,
        private _editCategoryUseCase: IEditCategoryUseCase,
        private _deleteCategoryUseCase: IDeleteCategoryUseCase,
        private _adminCategoryListingUseCase: IAdminCategoryListingUseCase
    ) {}

    async addCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { name, description } = req.body as CategoryRequestBody;
            const category = await this._addCategoryUseCase.add(name, description);
            return res.status(StatusCode.CREATED).json({ success: true, category });
        } catch (error: unknown) {
            const statusCode = error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to add category",
            });
        }
    }
    async getCategory(req: Request, res: Response): Promise<Response> {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(50, Number(req.query.limit) || 10);
            const { search, sort } = req.query;

            const data = await this._adminCategoryListingUseCase.getAllCategories(page, limit, {
                search: search as string,
                sort: sort as "newest" | "oldest",
            });

            return res.status(StatusCode.OK).json({
                success: true,
                ...data,
            });
        } catch (error: unknown) {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
            });
        }
    }

    async editCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { categoryId } = req.params;
            const { name, description } = req.body as CategoryRequestBody;
            const category = await this._editCategoryUseCase.edit(categoryId, name, description);
            return res.status(StatusCode.OK).json({ success: true, category });
        } catch (error: unknown) {
            const statusCode = error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to edit category",
            });
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { categoryId } = req.params;
            await this._deleteCategoryUseCase.delete(categoryId);
            return res.status(StatusCode.OK).json({ success: true, message: "Category deleted successfully" });
        } catch (error: unknown) {
            const statusCode = error instanceof AppError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to delete category",
            });
        }
    }

}

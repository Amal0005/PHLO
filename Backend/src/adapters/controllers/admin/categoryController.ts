import type { Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import { AppError } from "@/domain/errors/appError";
import { MESSAGES } from "@/constants/commonMessages";
import type { IAddCategoryUseCase } from "@/domain/interfaces/admin/IAddCategoryUseCase";
import type { IEditCategoryUseCase } from "@/domain/interfaces/admin/IEditCategoryUseCase";
import type { IDeleteCategoryUseCase } from "@/domain/interfaces/admin/IDeleteCategoryUseCase";
import type { IAdminCategoryListingUseCase } from "@/domain/interfaces/admin/IAdminCategoryListingUseCase";

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
                message: error instanceof Error ? error.message : MESSAGES.ADMIN.CATEGORY_ADD_FAILED,
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
                message: error instanceof Error ? error.message : MESSAGES.ADMIN.CATEGORY_EDIT_FAILED,
            });
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { categoryId } = req.params;
            await this._deleteCategoryUseCase.delete(categoryId);
            return res.status(StatusCode.OK).json({ success: true, message: MESSAGES.ADMIN.CATEGORY_DELETED });
        } catch (error: unknown) {
            const statusCode = error instanceof AppError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : MESSAGES.ADMIN.CATEGORY_DELETE_FAILED,
            });
        }
    }

}

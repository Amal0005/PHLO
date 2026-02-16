import { IEditCategoryUseCase } from "@/domain/interface/admin/IEditCategoryUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AppError } from "@/domain/errors/appError";

interface EditCategoryRequestBody {
    name: string;
    description?: string;
}

export class EditCategoryController {
    constructor(private _editCategoryUseCase: IEditCategoryUseCase) { }

    async editCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { categoryId } = req.params;
            const { name, description } = req.body as EditCategoryRequestBody;
            const category = await this._editCategoryUseCase.edit(
                categoryId,
                name,
                description,
            );
            return res.status(StatusCode.OK).json({ success: true, category });
        } catch (error: unknown) {
            const statusCode = error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to edit category"
            });
        }
    }
}

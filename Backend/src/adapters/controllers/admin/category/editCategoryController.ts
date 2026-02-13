import { IEditCategoryUseCase } from "@/domain/interface/admin/IEditCategoryUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class EditCategoryController {
    constructor(private _editCategoryUseCase: IEditCategoryUseCase) { }

    async execute(req: Request, res: Response) {
        try {
            const { categoryId } = req.params;
            const { name, description } = req.body;
            const category = await this._editCategoryUseCase.edit(
                categoryId,
                name,
                description,
            );
            res.status(StatusCode.OK).json({ success: true, category });
        } catch (error: any) {
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}

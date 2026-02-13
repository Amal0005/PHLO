import { IAddCategoryUseCase } from "@/domain/interface/admin/IAddCategoryUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class AddCategoryController {
    constructor(private _addCategoryUseCase: IAddCategoryUseCase) { }

    async execute(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            const category = await this._addCategoryUseCase.add(name, description);
            res.status(StatusCode.CREATED).json({ success: true, category });
        } catch (error: any) {
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}

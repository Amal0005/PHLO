import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { MESSAGES } from "@/utils/commonMessages";
import { IAddPackageUseCase } from "@/domain/interface/creator/package/IAddPackageUseCase";
import { IDeletePackageUseCase } from "@/domain/interface/creator/package/IDeletePackageUseCase";
import { IEditPackageUseCase } from "@/domain/interface/creator/package/IEditPackageUseCase";
import { IgetPackagesUseCase } from "@/domain/interface/creator/package/IGetPackageUseCase";

export class PackageController {
    constructor(
        private _addPackageUseCase: IAddPackageUseCase,
        private _deletePackageUseCase: IDeletePackageUseCase,
        private _editPackageUseCase: IEditPackageUseCase,
        private _getPackagesUseCase: IgetPackagesUseCase
    ) {}

    async addPackage(req: AuthRequest, res: Response) {
        try {
            const creatorId = req.user?.userId;
            if (!creatorId) {
                return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
            }
            const packageData = { ...req.body, creatorId };

            const result = await this._addPackageUseCase.addPackage(packageData);
            res.status(StatusCode.CREATED).json({ success: true, data: result });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
        }
    }

    async getPackages(req: AuthRequest, res: Response) {
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

    async editPackage(req: AuthRequest, res: Response) {
        try {
            const creatorId = req.user?.userId;
            const { packageId } = req.params;

            if (!creatorId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: MESSAGES.ERROR.UNAUTHORIZED
                });
            }

            if (!packageId) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Package ID is required"
                });
            }

            const updatedPackage = await this._editPackageUseCase.editPackage(
                packageId,
                creatorId,
                req.body
            );

            res.status(StatusCode.OK).json({
                success: true,
                data: updatedPackage,
                message: "Package updated successfully"
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;

            if (message === "Package not found") {
                return res.status(StatusCode.NOT_FOUND).json({
                    success: false,
                    message: message
                });
            }

            if (message.includes("Unauthorized")) {
                return res.status(StatusCode.FORBIDDEN).json({
                    success: false,
                    message: message
                });
            }

            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: message
            });
        }
    }

    async deletePackage(req: AuthRequest, res: Response) {
        try {
            const creatorId = req.user?.userId;
            const { packageId } = req.params;

            if (!creatorId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: MESSAGES.ERROR.UNAUTHORIZED
                });
            }

            if (!packageId) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Package ID is required"
                });
            }

            await this._deletePackageUseCase.deletePackage(packageId, creatorId);

            res.status(StatusCode.OK).json({
                success: true,
                message: "Package deleted successfully"
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;

            if (message === "Package not found") {
                return res.status(StatusCode.NOT_FOUND).json({
                    success: false,
                    message: message
                });
            }

            if (message.includes("Unauthorized")) {
                return res.status(StatusCode.FORBIDDEN).json({
                    success: false,
                    message: message
                });
            }

            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: message
            });
        }
    }
}

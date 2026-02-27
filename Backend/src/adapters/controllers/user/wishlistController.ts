import { IToggleWishlistUseCase } from "@/domain/interface/user/wishlist/IToggleWishlistUseCase";
import { IGetWishlistUseCase } from "@/domain/interface/user/wishlist/IGetWishlistUseCase";
import { IGetWishlistIdsUseCase } from "@/domain/interface/user/wishlist/IGetWishlistIdsUseCase";
import { MESSAGES } from "@/utils/commonMessages";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class WishlistController {
    constructor(
        private _toggleWishlistUseCase: IToggleWishlistUseCase,
        private _getWishlistUseCase: IGetWishlistUseCase,
        private _getWishlistIdsUseCase: IGetWishlistIdsUseCase
    ) {}

    async toggle(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.userId;
            const { itemId, itemType } = req.body;
            if (!userId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "User must be logged in",
                });
            }
            if (!itemId || !itemType) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "itemId and itemType are required",
                });
            }
            const result = await this._toggleWishlistUseCase.toggleItem(userId, itemId, itemType);
            return res.status(StatusCode.OK).json({
                success: true,
                wishlisted: result.wishlisted,
            });
        } catch (error: unknown) {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
            });
        }
    }

    async getWishlist(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "User must be logged in",
                });
            }

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 12;
            const itemType = req.query.itemType as "wallpaper" | "package" | undefined;

            const result = await this._getWishlistUseCase.getWishlist(userId, itemType, page, limit);
            return res.status(StatusCode.OK).json({
                success: true,
                ...result,
            });
        } catch (error: unknown) {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
            });
        }
    }

    async getWishlistIds(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "User must be logged in",
                });
            }

            const itemType = req.query.itemType as "wallpaper" | "package";
            const ids = await this._getWishlistIdsUseCase.getItems(userId, itemType);
            return res.status(StatusCode.OK).json({
                success: true,
                ids,
            });
        } catch (error: unknown) {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
            });
        }
    }
}

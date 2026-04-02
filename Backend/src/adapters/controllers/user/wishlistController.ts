import type { IToggleWishlistUseCase } from "@/domain/interfaces/user/wishlist/IToggleWishlistUseCase";
import type { IGetWishlistUseCase } from "@/domain/interfaces/user/wishlist/IGetWishlistUseCase";
import type { IGetWishlistIdsUseCase } from "@/domain/interfaces/user/wishlist/IGetWishlistIdsUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import { StatusCode } from "@/constants/statusCodes";
import type { Response } from "express";
import type { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";

export class WishlistController {
    constructor(
        private _toggleWishlistUseCase: IToggleWishlistUseCase,
        private _getWishlistUseCase: IGetWishlistUseCase,
        private _getWishlistIdsUseCase: IGetWishlistIdsUseCase
    ) {}

    async toggle(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            const { itemId, itemType } = req.body;
            if (!userId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: MESSAGES.USER.MUST_BE_LOGGED_IN,
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

    async getWishlist(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: MESSAGES.USER.MUST_BE_LOGGED_IN,
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

    async getWishlistIds(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: MESSAGES.USER.MUST_BE_LOGGED_IN,
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

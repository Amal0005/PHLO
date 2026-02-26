import { IGetWishlistUseCase } from "@/domain/interface/user/wishlist/IGetWishlistUseCase";
import { IWishlistRepository } from "@/domain/interface/repositories/IWishlistRepository";

export class GetWishlistUseCase implements IGetWishlistUseCase {
    constructor(private _wishlistRepo: IWishlistRepository) { }

    async getWishlist(userId: string, itemType?: "wallpaper" | "package", page: number = 1, limit: number = 12) {
        if (!userId) throw new Error("User ID is required");

        const result = await this._wishlistRepo.findByUser(userId, itemType, page, limit);
        return {
            data: result.data.map((item) => ({
                itemId: item.itemId,
                itemType: item.itemType,
                createdAt: item.createdAt,
            })),
            total: result.total,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit),
        };
    }
}

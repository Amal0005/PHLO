import { WishlistMapper } from "@/application/mapper/user/wishlistMapper";
import type { IGetWishlistUseCase } from "@/domain/interfaces/user/wishlist/IGetWishlistUseCase";
import type { IWishlistRepository } from "@/domain/interfaces/repository/IWishlistRepository";

export class GetWishlistUseCase implements IGetWishlistUseCase {
    constructor(
        private _wishlistRepo: IWishlistRepository
    ) {}

    async getWishlist(userId: string, itemType?: "wallpaper" | "package", page: number = 1, limit: number = 12) {
        if (!userId) throw new Error("User ID is required");

        const result = await this._wishlistRepo.findByUser(userId, itemType, page, limit);
        return {
            data: result.data.map(item => WishlistMapper.toDto(item)),
            total: result.total,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit),
        };
    }
}

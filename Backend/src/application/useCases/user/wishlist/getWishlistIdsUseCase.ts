import { IGetWishlistIdsUseCase } from "@/domain/interface/user/wishlist/IGetWishlistIdsUseCase";
import { IWishlistRepository } from "@/domain/interface/repositories/IWishlistRepository";

export class GetWishlistIdsUseCase implements IGetWishlistIdsUseCase {
    constructor(private _wishlistRepo: IWishlistRepository) { }

    async getItems(userId: string, itemType: "wallpaper" | "package"): Promise<string[]> {
        if (!userId) throw new Error("User ID is required");
        return this._wishlistRepo.getWishlistedItem(userId, itemType);
    }
}

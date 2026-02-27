import { IToggleWishlistUseCase } from "@/domain/interface/user/wishlist/IToggleWishlistUseCase";
import { IWishlistRepository } from "@/domain/interface/repositories/IWishlistRepository";

export class ToggleWishlistUseCase implements IToggleWishlistUseCase {
    constructor(private _wishlistRepo: IWishlistRepository) { }

    async toggleItem(userId: string, itemId: string, itemType: "wallpaper" | "package"): Promise<{ wishlisted: boolean }> {
        if (!userId) throw new Error("User ID is required");
        if (!itemId) throw new Error("Item ID is required");
        if (!itemType) throw new Error("Item type is required");

        const wishlisted = await this._wishlistRepo.toggle(userId, itemId, itemType);
        return { wishlisted };
    }
}

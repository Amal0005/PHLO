import { WishlistEntity } from "@/domain/entities/wishlistEntity";

export interface IWishlistRepository {
  toggle(userId: string, itemId: string, itemType: "wallpaper" | "package"): Promise<boolean>;
  findByUser(userId: string, itemType?: "wallpaper" | "package", page?: number, limit?: number): Promise<{ data: WishlistEntity[]; total: number }>;
  isWishlisted(userId: string, itemId: string, itemType: "wallpaper" | "package"): Promise<boolean>;
  getWishlistedItem(userId: string, itemType: "wallpaper" | "package"): Promise<string[]>;
}

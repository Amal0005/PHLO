export interface IToggleWishlistUseCase {
    toggleItem(userId: string, itemId: string, itemType: "wallpaper" | "package"): Promise<{ wishlisted: boolean }>;
}

export interface IGetWishlistIdsUseCase {
    getItems(userId: string, itemType: "wallpaper" | "package"): Promise<string[]>;
}

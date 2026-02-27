export interface WishlistEntity {
    _id?: string;
    userId: string;
    itemId: string;
    itemType: "wallpaper" | "package";
    createdAt?: Date;
}

export interface WishlistResponseDto {
    itemId: string;
    itemType: "wallpaper" | "package";
    createdAt?: Date;
}

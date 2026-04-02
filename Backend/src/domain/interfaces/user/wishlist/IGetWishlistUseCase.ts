export interface IGetWishlistUseCase {
    getWishlist(userId: string, itemType?: "wallpaper" | "package", page?: number, limit?: number): Promise<{
        data: { itemId: string; itemType: string; createdAt?: Date }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}

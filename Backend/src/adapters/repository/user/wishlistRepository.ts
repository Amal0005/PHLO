import { IWishlistRepository } from "@/domain/interface/repositories/IWishlistRepository";
import { WishlistEntity } from "@/domain/entities/wishlistEntity";
import { WishlistModel } from "@/framework/database/model/wishlistModel";

export class WishlistRepository implements IWishlistRepository {
    async toggle(userId: string, itemId: string, itemType: "wallpaper" | "package"): Promise<boolean> {
        const existing = await WishlistModel.findOneAndDelete({ userId, itemId, itemType });
        if (existing) {
            return false; // removed
        }
        await WishlistModel.create({ userId, itemId, itemType });
        return true; // added
    }

    async findByUser(
        userId: string,
        itemType?: "wallpaper" | "package",
        page: number = 1,
        limit: number = 12
    ): Promise<{ data: WishlistEntity[]; total: number }> {
        const filter: Record<string, unknown> = { userId };
        if (itemType) filter.itemType = itemType;

        const total = await WishlistModel.countDocuments(filter);
        const data = await WishlistModel.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return {
            data: data.map((d) => ({
                _id: d._id.toString(),
                userId: d.userId.toString(),
                itemId: d.itemId.toString(),
                itemType: d.itemType,
                createdAt: d.createdAt,
            })),
            total,
        };
    }

    async isWishlisted(userId: string, itemId: string, itemType: "wallpaper" | "package"): Promise<boolean> {
        const exists = await WishlistModel.exists({ userId, itemId, itemType });
        return !!exists;
    }

    async getWishlistedItem(userId: string, itemType: "wallpaper" | "package"): Promise<string[]> {
        const docs = await WishlistModel.find({ userId, itemType }).select("itemId").lean();
        return docs.map((d) => d.itemId.toString());
    }
}

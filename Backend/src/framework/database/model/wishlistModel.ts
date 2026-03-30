import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { WishlistEntity } from "@/domain/entities/wishlistEntity";
import { wishlistSchema } from "@/framework/database/schema/wishlistSchema";

export interface IWishlistModel extends Omit<WishlistEntity, "_id">, Document {
    _id: Types.ObjectId;
}

export const WishlistModel = model<IWishlistModel>("wishlist", wishlistSchema);

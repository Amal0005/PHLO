import { model, Document, Types } from "mongoose";
import { WishlistEntity } from "@/domain/entities/wishlistEntity";
import { wishlistSchema } from "../schema/wishlistSchema";

export interface IWishlistModel extends Omit<WishlistEntity, "_id">, Document {
    _id: Types.ObjectId;
}

export const WishlistModel = model<IWishlistModel>("wishlist", wishlistSchema);

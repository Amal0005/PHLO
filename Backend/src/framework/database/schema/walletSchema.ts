import { Schema, model } from "mongoose";

const walletSchema = new Schema(
    {
        ownerId: { type: String, required: true },
        ownerType: { type: String, enum: ["admin", "user", "creator"], required: true },
        balance: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

walletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

export const WalletModel = model("wallet", walletSchema);

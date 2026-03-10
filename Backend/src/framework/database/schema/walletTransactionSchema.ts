import { Schema, model, Types } from "mongoose";

const walletTransactionSchema = new Schema(
    {
        walletId: { type: Types.ObjectId, ref: "wallet", required: true },
        amount: { type: Number, required: true },
        type: { type: String, enum: ["credit", "debit"], required: true },
        description: { type: String, required: true },
        source: { type: String, enum: ["subscription", "wallpaper", "booking", "withdrawal", "refund"], required: true },
        sourceId: { type: String, required: true },
        relatedName: { type: String },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const WalletTransactionModel = model("walletTransaction", walletTransactionSchema);

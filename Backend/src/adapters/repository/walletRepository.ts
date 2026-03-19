import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";
import { Wallet, WalletOwnerType } from "@/domain/entities/walletEntity";
import { WalletTransaction } from "@/domain/entities/walletTransactionEntity";
import { WalletModel } from "@/framework/database/schema/walletSchema";
import { WalletTransactionModel } from "@/framework/database/schema/walletTransactionSchema";
import mongoose from "mongoose";

export class WalletRepository implements IWalletRepository {
    async getWallet(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet> {
        let wallet = await WalletModel.findOne({ ownerId, ownerType });
        if (!wallet) {
            wallet = await WalletModel.create({ ownerId, ownerType, balance: 0 });
        }
        return {
            id: wallet._id.toString(),
            ownerId: wallet.ownerId,
            ownerType: wallet.ownerType as WalletOwnerType,
            balance: wallet.balance,
            lastUpdated: wallet.lastUpdated,
        };
    }

    async updateBalance(
        ownerId: string,
        ownerType: WalletOwnerType,
        amount: number,
        transactionData: Omit<WalletTransaction, "id" | "walletId" | "timestamp">
    ): Promise<void> {
        try {
            // Find or create wallet with balance update
            const wallet = await WalletModel.findOneAndUpdate(
                { ownerId, ownerType },
                { $inc: { balance: amount }, lastUpdated: new Date() },
                { upsert: true, new: true }
            );

            // Record transaction
            await WalletTransactionModel.create({
                ...transactionData,
                walletId: wallet._id,
            });

        } catch (error) {
            console.error("WalletRepository updateBalance error:", error);
            throw error;
        }
    }

    async getTransactions(walletId: string, search?: string, source?: string, page: number = 1, limit: number = 10): Promise<{ transactions: WalletTransaction[]; total: number }> {
        const query: Record<string, unknown> = { walletId: new mongoose.Types.ObjectId(walletId) };

        if (search && search.trim() !== "") {
            const searchRegex = { $regex: search.trim(), $options: "i" };
            query.$or = [
                { relatedName: searchRegex },
                { description: searchRegex }
            ];
        }

        if (source && source.trim() !== "") {
            const sources = source.split(",").map(s => s.trim()).filter(Boolean);
            if (sources.length > 1) {
                query.source = { $in: sources };
            } else if (sources.length === 1) {
                query.source = sources[0];
            }
        }

        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            WalletTransactionModel.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit),
            WalletTransactionModel.countDocuments(query)
        ]);

        return {
            transactions: transactions.map((t) => ({
                id: t._id.toString(),
                walletId: t.walletId.toString(),
                amount: t.amount,
                type: t.type as "credit" | "debit",
                description: t.description,
                source: t.source as "subscription" | "wallpaper" | "booking" | "withdrawal" | "refund",
                sourceId: t.sourceId,
                relatedName: (t as unknown as { relatedName?: string }).relatedName,
                timestamp: t.timestamp,
            })),
            total
        };
    }
}

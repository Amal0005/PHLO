import { IWalletRepository } from "@/domain/interface/repositories/IWalletRepository";
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

    async getTransactions(walletId: string): Promise<WalletTransaction[]> {
        const transactions = await WalletTransactionModel.find({ walletId }).sort({ timestamp: -1 });
        return transactions.map((t) => ({
            id: t._id.toString(),
            walletId: t.walletId.toString(),
            amount: t.amount,
            type: t.type as any,
            description: t.description,
            source: t.source as any,
            sourceId: t.sourceId,
            relatedName: (t as any).relatedName,
            timestamp: t.timestamp,
        }));
    }
}

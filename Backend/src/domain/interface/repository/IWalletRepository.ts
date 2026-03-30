import type { Wallet, WalletOwnerType } from "@/domain/entities/walletEntity";
import type { WalletTransaction } from "@/domain/entities/walletTransactionEntity";

export interface IWalletRepository {
    getWallet(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet>;
    updateBalance(ownerId: string, ownerType: WalletOwnerType, amount: number, transactionData: Omit<WalletTransaction, "id" | "walletId" | "timestamp">): Promise<void>;
    getTransactions(walletId: string, search?: string, source?: string, page?: number, limit?: number): Promise<{ transactions: WalletTransaction[]; total: number }>;
}

import { Wallet, WalletOwnerType } from "../../entities/walletEntity";
import { WalletTransaction } from "../../entities/walletTransactionEntity";

export interface IWalletRepository {
    getWallet(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet>;
    updateBalance(ownerId: string, ownerType: WalletOwnerType, amount: number, transactionData: Omit<WalletTransaction, "id" | "walletId" | "timestamp">): Promise<void>;
    getTransactions(walletId: string): Promise<WalletTransaction[]>;
}

import { Wallet, WalletOwnerType } from "@/domain/entities/walletEntity";
import { WalletTransaction } from "@/domain/entities/walletTransactionEntity";

export interface IGetWalletUseCase {
    getWallet(ownerId: string, ownerType: WalletOwnerType, search?: string, source?: string, page?: number, limit?: number): Promise<{
        wallet: Wallet;
        transactions: WalletTransaction[];
        totalTransactions: number;
    }>;
}

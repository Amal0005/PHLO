import type { WalletOwnerType } from "@/domain/entities/walletEntity";
import type { WalletTransaction } from "@/domain/entities/walletTransactionEntity";

export interface ICreditWalletUseCase {
    creditWallet(
        ownerId: string,
        ownerType: WalletOwnerType,
        amount: number,
        transactionData: Omit<WalletTransaction, "id" | "walletId" | "timestamp">
    ): Promise<void>;
}

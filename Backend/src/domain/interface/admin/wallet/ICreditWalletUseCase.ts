import { WalletOwnerType } from "@/domain/entities/walletEntity";
import { WalletTransaction } from "@/domain/entities/walletTransactionEntity";

export interface ICreditWalletUseCase {
    execute(
        ownerId: string,
        ownerType: WalletOwnerType,
        amount: number,
        transactionData: Omit<WalletTransaction, "id" | "walletId" | "timestamp">
    ): Promise<void>;
}

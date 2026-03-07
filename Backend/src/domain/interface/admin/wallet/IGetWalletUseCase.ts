import { Wallet, WalletOwnerType } from "@/domain/entities/walletEntity";
import { WalletTransaction } from "@/domain/entities/walletTransactionEntity";

export interface IGetWalletUseCase {
    execute(ownerId: string, ownerType: WalletOwnerType): Promise<{
        wallet: Wallet;
        transactions: WalletTransaction[];
    }>;
}

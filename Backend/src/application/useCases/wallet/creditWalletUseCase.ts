import type { ICreditWalletUseCase } from "@/domain/interfaces/wallet/ICreditWalletUseCase";
import type { IWalletRepository } from "@/domain/interfaces/repository/IWalletRepository";
import type { WalletOwnerType } from "@/domain/entities/walletEntity";
import type { WalletTransaction } from "@/domain/entities/walletTransactionEntity";

export class CreditWalletUseCase implements ICreditWalletUseCase {
    constructor(private _walletRepo: IWalletRepository){}

    async creditWallet(
        ownerId: string,
        ownerType: WalletOwnerType,
        amount: number,
        transactionData: Omit<WalletTransaction, "id" | "walletId" | "timestamp">
    ): Promise<void> {
        await this._walletRepo.updateBalance(ownerId, ownerType, amount, transactionData);
    }
}

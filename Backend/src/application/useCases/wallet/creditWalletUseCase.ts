import { ICreditWalletUseCase } from "@/domain/interface/wallet/ICreditWalletUseCase";
import { IWalletRepository } from "@/domain/interface/repositories/IWalletRepository";
import { WalletOwnerType } from "@/domain/entities/walletEntity";
import { WalletTransaction } from "@/domain/entities/walletTransactionEntity";

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

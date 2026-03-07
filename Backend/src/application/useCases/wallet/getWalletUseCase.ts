import { IGetWalletUseCase } from "@/domain/interface/admin/wallet/IGetWalletUseCase";
import { IWalletRepository } from "@/domain/interface/repositories/IWalletRepository";
import { Wallet, WalletOwnerType } from "@/domain/entities/walletEntity";
import { WalletTransaction } from "@/domain/entities/walletTransactionEntity";

export class GetWalletUseCase implements IGetWalletUseCase {
    constructor(private _walletRepo: IWalletRepository) { }

    async execute(
        ownerId: string,
        ownerType: WalletOwnerType
    ): Promise<{ wallet: Wallet; transactions: WalletTransaction[] }> {
        const wallet = await this._walletRepo.getWallet(ownerId, ownerType);
        const transactions = await this._walletRepo.getTransactions(wallet.id as string);
        return { wallet, transactions };
    }
}

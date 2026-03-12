import { IGetWalletUseCase } from "@/domain/interface/wallet/IGetWalletUseCase";
import { IWalletRepository } from "@/domain/interface/repositories/IWalletRepository";
import { Wallet, WalletOwnerType } from "@/domain/entities/walletEntity";
import { WalletTransaction } from "@/domain/entities/walletTransactionEntity";

export class GetWalletUseCase implements IGetWalletUseCase {
    constructor(private _walletRepo: IWalletRepository){}

    async getWallet(
        ownerId: string,
        ownerType: WalletOwnerType,
        search?: string,
        source?: string,
        page?: number,
        limit?: number
    ): Promise<{ wallet: Wallet; transactions: WalletTransaction[]; totalTransactions: number }> {
        const wallet = await this._walletRepo.getWallet(ownerId, ownerType);
        const { transactions, total } = await this._walletRepo.getTransactions(wallet.id!, search, source, page, limit);
        return { wallet, transactions, totalTransactions: total };
    }
}

import type { IGetWalletUseCase } from "@/domain/interface/wallet/IGetWalletUseCase";
import type { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";
import type { WalletOwnerType } from "@/domain/entities/walletEntity";
import type { WalletResponseDTO } from "@/domain/dto/wallet/walletResponseDto";
import { WalletMapper } from "@/application/mapper/walletMapper";

export class GetWalletUseCase implements IGetWalletUseCase {
    constructor(private _walletRepo: IWalletRepository){}

    async getWallet(
        ownerId: string,
        ownerType: WalletOwnerType,
        search?: string,
        source?: string,
        page?: number,
        limit?: number
    ): Promise<WalletResponseDTO> {
        const wallet = await this._walletRepo.getWallet(ownerId, ownerType);
        const { transactions, total } = await this._walletRepo.getTransactions(wallet.id!, search, source, page, limit);
        return WalletMapper.toWalletDto(wallet, transactions, total);
    }
}

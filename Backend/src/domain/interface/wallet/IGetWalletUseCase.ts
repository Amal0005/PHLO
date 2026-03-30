import type { WalletOwnerType } from "@/domain/entities/walletEntity";
import type { WalletResponseDTO } from "@/domain/dto/wallet/walletResponseDto";

export interface IGetWalletUseCase {
    getWallet(ownerId: string, ownerType: WalletOwnerType, search?: string, source?: string, page?: number, limit?: number): Promise<WalletResponseDTO>;
}

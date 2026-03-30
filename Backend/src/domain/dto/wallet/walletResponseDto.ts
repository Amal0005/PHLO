import type { WalletOwnerType } from "@/domain/entities/walletEntity";
import type { WalletTransactionResponseDTO } from "@/domain/dto/wallet/walletTransactionResponseDto";

export interface WalletResponseDTO {
  wallet: {
    id: string;
    ownerId: string;
    ownerType: WalletOwnerType;
    balance: number;
    lastUpdated: Date;
  };
  transactions: WalletTransactionResponseDTO[];
  totalTransactions: number;
}

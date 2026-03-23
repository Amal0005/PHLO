import { WalletOwnerType } from "@/domain/entities/walletEntity";
import { WalletTransactionResponseDTO } from "./walletTransactionResponseDto";

export interface WalletResponseDTO {
  id: string;
  ownerId: string;
  ownerType: WalletOwnerType;
  balance: number;
  lastUpdated: Date;
  transactions: WalletTransactionResponseDTO[];
  totalTransactions: number;
}

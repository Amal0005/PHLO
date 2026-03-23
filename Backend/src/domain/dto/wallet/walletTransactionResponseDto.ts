import { TransactionType, TransactionSource } from "@/domain/entities/walletTransactionEntity";

export interface WalletTransactionResponseDTO {
  id: string;
  walletId: string;
  amount: number;
  type: TransactionType;
  description: string;
  source: TransactionSource;
  sourceId: string;
  relatedName?: string;
  timestamp: Date;
}

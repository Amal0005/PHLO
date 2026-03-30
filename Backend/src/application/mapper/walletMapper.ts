import { Wallet } from "@/domain/entities/walletEntity";
import { WalletTransaction } from "@/domain/entities/walletTransactionEntity";
import { WalletResponseDTO } from "@/domain/dto/wallet/walletResponseDto";
import { WalletTransactionResponseDTO } from "@/domain/dto/wallet/walletTransactionResponseDto";

export class WalletMapper {
  static toTransactionDto(entity: WalletTransaction): WalletTransactionResponseDTO {
    const txData = entity as unknown as { _id?: { toString(): string } };
    return {
      id: entity.id || txData._id?.toString() || "",
      walletId: entity.walletId,
      amount: entity.amount,
      type: entity.type,
      description: entity.description,
      source: entity.source,
      sourceId: entity.sourceId,
      relatedName: entity.relatedName,
      timestamp: entity.timestamp,
    };
  }

  static toTransactionDtoList(entities: WalletTransaction[]): WalletTransactionResponseDTO[] {
    return entities.map((entity) => this.toTransactionDto(entity));
  }

  static toWalletDto(wallet: Wallet, transactions: WalletTransaction[], totalTransactions: number): WalletResponseDTO {
    const walletData = wallet as unknown as { _id?: { toString(): string } };
    return {
      wallet: {
        id: wallet.id || walletData._id?.toString() || "",
        ownerId: wallet.ownerId,
        ownerType: wallet.ownerType,
        balance: wallet.balance,
        lastUpdated: wallet.lastUpdated,
      },
      transactions: this.toTransactionDtoList(transactions),
      totalTransactions,
    };
  }
}

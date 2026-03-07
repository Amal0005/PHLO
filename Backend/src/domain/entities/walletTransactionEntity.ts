export type TransactionType = "credit" | "debit";
export type TransactionSource = "subscription" | "wallpaper" | "booking" | "withdrawal" | "refund";

export interface WalletTransaction {
    id?: string;
    walletId: string;
    amount: number;
    type: TransactionType;
    description: string;
    source: TransactionSource;
    sourceId: string;
    relatedName?: string;
    timestamp: Date;
}

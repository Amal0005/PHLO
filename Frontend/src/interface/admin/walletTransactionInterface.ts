export interface WalletTransaction {
    id: string;
    walletId: string;
    amount: number;
    type: "credit" | "debit";
    description: string;
    source: "subscription" | "wallpaper" | "booking" | "withdrawal" | "refund";
    sourceId: string;
    relatedName?: string;
    timestamp: Date | string;
}

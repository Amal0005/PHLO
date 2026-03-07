export type WalletOwnerType = "admin" | "user" | "creator";

export interface Wallet {
    id?: string;
    ownerId: string;
    ownerType: WalletOwnerType;
    balance: number;
    lastUpdated: Date;
}

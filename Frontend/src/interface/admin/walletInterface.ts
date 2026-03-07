export interface Wallet {
    id: string;
    ownerId: string;
    ownerType: "admin" | "user" | "creator";
    balance: number;
    lastUpdated: Date | string;
}

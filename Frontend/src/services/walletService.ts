import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export interface WalletTransaction {
    id: string;
    amount: number;
    type: "credit" | "debit";
    description: string;
    source: string;
    sourceId: string;
    timestamp: string;
    relatedName?: string;
}

export interface WalletData {
    wallet: {
        id: string;
        balance: number;
        lastUpdated: string;
    };
    transactions: WalletTransaction[];
    totalTransactions: number;
}

export class WalletService {
    static async getWallet(role: "user" | "creator", params: { page?: number; limit?: number; search?: string; source?: string } = {}): Promise<WalletData> {
        const url = role === "user" ? FRONTEND_ROUTES.USER.WALLET : FRONTEND_ROUTES.CREATOR.WALLET;
        const response = await api.get(url, { params });
        return response.data.result;
    }
}

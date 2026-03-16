import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const fetchAdminWalletTransactions = async (page: number, limit: number, search?: string, source?: string) => {
    try {
        const response = await api.get(FRONTEND_ROUTES.ADMIN.WALLET, {
            params: { search, source, page, limit }
        });
        return response.data;
    } catch (error: unknown) {
        throw (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Something went wrong";
    }
};

import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

const adminWalletService = {
    getWallet: async () => {
        try {
            const response = await api.get(FRONTEND_ROUTES.ADMIN.WALLET);
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.message || "Something went wrong";
        }
    },
};

export default adminWalletService;

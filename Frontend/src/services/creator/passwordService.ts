import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const passwordService = {
    sendForgotPasswordOtp: async (email: string) => {
        const res = await api.post(FRONTEND_ROUTES.CREATOR.FORGOT_PASSWORD, { email });
        return res.data;
    },

    verifyForgotOtp: async (email: string, otp: string) => {
        const res = await api.post(FRONTEND_ROUTES.CREATOR.VERIFY_FORGOT_OTP, { email, otp });
        return res.data;
    },

    resetPassword: async (email: string, password: string, confirmPassword: string) => {
        const res = await api.post(FRONTEND_ROUTES.CREATOR.RESET_PASSWORD, { email, password, confirmPassword });
        return res.data;
    },
};

import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const passwordService = {
    sendForgotPasswordOtp: async (email: string) => {
        const res = await api.post(API_ENDPOINTS.CREATOR.FORGOT_PASSWORD, { email });
        return res.data;
    },

    verifyForgotOtp: async (email: string, otp: string) => {
        const res = await api.post(API_ENDPOINTS.CREATOR.VERIFY_FORGOT_OTP, { email, otp });
        return res.data;
    },

    resetPassword: async (email: string, password: string) => {
        const res = await api.post(API_ENDPOINTS.CREATOR.RESET_PASSWORD, { email, password });
        return res.data;
    },
};

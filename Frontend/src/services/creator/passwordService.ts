import api from "@/axios/axiosConfig";

export const passwordService = {
    sendForgotPasswordOtp: async (email: string) => {
        const res = await api.post("/creator/forgot-password", { email });
        return res.data;
    },

    verifyForgotOtp: async (email: string, otp: string) => {
        const res = await api.post("/creator/verify-forgot-otp", { email, otp });
        return res.data;
    },

    resetPassword: async (email: string, password: string) => {
        const res = await api.post("/creator/reset-password", { email, password });
        return res.data;
    },
};

import api from "@/axios/axiosConfig";

export const passwordService = {
  sendForgotPasswordOtp: async (email: string) => {
    const res = await api.post("/forgot-password", { email });
    return res.data;
  },

  verifyForgotOtp: async (email: string, otp: string) => {
    const res = await api.post("/verify-forgot-otp", { email, otp });
    return res.data;
  },

  resetPassword: async (email: string, password: string) => {
    const res = await api.post("/reset-password", { email, password });
    return res.data;
  },
};

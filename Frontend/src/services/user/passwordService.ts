import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const passwordService = {
  sendForgotPasswordOtp: async (email: string) => {
    const res = await api.post(FRONTEND_ROUTES.USER.FORGOT_PASSWORD, { email });
    return res.data;
  },

  verifyForgotOtp: async (email: string, otp: string) => {
    const res = await api.post(FRONTEND_ROUTES.USER.VERIFY_FORGOT_OTP, { email, otp });
    return res.data;
  },

  resetPassword: async (email: string, password: string) => {
    const res = await api.post(FRONTEND_ROUTES.USER.RESET_PASSWORD, { email, password });
    return res.data;
  },
};

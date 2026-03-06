import api from "@/axios/axiosConfig";
import { ResendOtpPayload, userLoginPayload, UserRegisterPayload, VerifyOtpPayload } from "@/interface/user/userAuthInterface";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const UserAuthService = {
  register: async (payload: UserRegisterPayload) => {
    const res = await api.post(FRONTEND_ROUTES.USER.REGISTER, payload)
    return res.data
  },
  login: async (payload: userLoginPayload) => {
    const res = await api.post(FRONTEND_ROUTES.USER.LOGIN, payload);
    return res.data;
  },
  googleLogin: async (idToken: string) => {
    const res = await api.post(FRONTEND_ROUTES.USER.GOOGLE_LOGIN, { idToken });
    return res.data;
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    const res = await api.post(FRONTEND_ROUTES.USER.VERIFY_OTP, payload)
    return res.data
  },
  resendOtp: async (payload: ResendOtpPayload) => {
    const res = await api.post(FRONTEND_ROUTES.USER.RESEND_OTP, payload)
    return res.data
  },
  logout: async (): Promise<void> => {
    await api.post(FRONTEND_ROUTES.USER.LOGOUT)
  }
};

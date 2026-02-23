import api from "@/axios/axiosConfig";
import { ResendOtpPayload, userLoginPayload, UserRegisterPayload, VerifyOtpPayload } from "@/interface/user/userAuthInterface";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const UserAuthService = {
  register: async (payload: UserRegisterPayload) => {
    const res = await api.post(API_ENDPOINTS.USER.REGISTER, payload)
    return res.data
  },
  login: async (payload: userLoginPayload) => {
    const res = await api.post(API_ENDPOINTS.USER.LOGIN, payload);
    return res.data;
  },
  googleLogin: async (idToken: string) => {
    const res = await api.post(API_ENDPOINTS.USER.GOOGLE_LOGIN, { idToken });
    return res.data;
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    const res = await api.post(API_ENDPOINTS.USER.VERIFY_OTP, payload)
    return res.data
  },
  resendOtp: async (payload: ResendOtpPayload) => {
    const res = await api.post(API_ENDPOINTS.USER.RESEND_OTP, payload)
    return res.data
  },
  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.USER.LOGOUT)
  }
};

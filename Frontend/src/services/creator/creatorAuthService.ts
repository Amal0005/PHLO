import api from "@/axios/axiosConfig";
import { CreatorLoginPayload, CreatorLoginResponse, CreatorRegisterPayload } from "@/interface/creator/creatorAuthInterface";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const CreatorAuthService = {
  login: async (Creator: CreatorLoginPayload): Promise<CreatorLoginResponse> => {
    const res = await api.post(API_ENDPOINTS.CREATOR.LOGIN, { Creator });
    return res.data.data;
  },

  checkCreatorExists: async (email: string, phone: string): Promise<void> => {
    await api.post(API_ENDPOINTS.CREATOR.CHECK_EMAIL, { email, phone });
  },

  register: async (payload: CreatorRegisterPayload) => {
    const res = await api.post(API_ENDPOINTS.CREATOR.REGISTER, payload);
    return res.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await api.post(API_ENDPOINTS.CREATOR.VERIFY_OTP, { email, otp });
    return res.data;
  },

  resendOtp: async (email: string) => {
    const res = await api.post(API_ENDPOINTS.CREATOR.RESEND_OTP, { email });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.CREATOR.LOGOUT)
  }
};

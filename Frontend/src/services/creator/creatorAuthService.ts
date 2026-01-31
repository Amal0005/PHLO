import api from "@/axios/axiosConfig";
import { CreatorLoginPayload, CreatorLoginResponse, CreatorRegisterPayload } from "@/interface/creator/creatorAuthInterface";

export const CreatorAuthService = {
  login: async (Creator: CreatorLoginPayload): Promise<CreatorLoginResponse> => {
    const res = await api.post("/creator/login", { Creator });
    return res.data.data;
  },

  checkCreatorExists: async (email: string, phone: string): Promise<void> => {
    await api.post("/creator/check-email", { email, phone });
  },

  register: async (payload: CreatorRegisterPayload) => {
    const res = await api.post("/creator/register", payload);
    return res.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await api.post("/creator/verify-otp", { email, otp });
    return res.data;
  },

  resendOtp: async (email: string) => {
    const res = await api.post("/creator/resend-otp", { email });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/creator/logout")
  }
};

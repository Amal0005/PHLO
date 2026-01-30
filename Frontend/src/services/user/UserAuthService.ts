import api from "@/axios/axiosConfig";
import { ResendOtpPayload, userLoginPayload, UserRegisterPayload, VerifyOtpPayload } from "@/interface/user/userAuthInterface";

export const UserAuthService = {
  register: async (payload: UserRegisterPayload) => {
    const res = await api.post("/register", payload)
    return res.data
  },
  login: async (payload: userLoginPayload) => {
    const res = await api.post("/login", payload);
    return res.data;
  },
  googleLogin: async (idToken: string) => {
    const res = await api.post("/auth/google", { idToken });
    return res.data;
  },
  verifyOtp: async (payload: VerifyOtpPayload) => {
    const res = await api.post("/verify-otp", payload)
    return res.data
  },
  resendOtp: async (payload: ResendOtpPayload) => {
    const res = await api.post("/resend-otp", payload)
    return res.data
  },
  logout: async (): Promise<void> => {
    await api.post("/logout")
  }
};

import api from "@/axios/axiosConfig";

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const res = await api.post("/login", payload);
    return res.data;
  },
  googleLogin: async (idToken: string) => {
  const res = await api.post("/auth/google", { idToken });
  return res.data;
}
};

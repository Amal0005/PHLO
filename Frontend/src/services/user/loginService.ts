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

  googleLoginUrl: "http://localhost:5000/api/user/google",
};

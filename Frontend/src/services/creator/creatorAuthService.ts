import api from "@/axios/axiosConfig";
import { CreatorLoginPayload, CreatorLoginResponse, CreatorRegisterPayload } from "@/interface/creator/creatorAuthInterface";

export const CreatorAuthService = {
  login: async (Creator:CreatorLoginPayload): Promise<CreatorLoginResponse> => {
    const res = await api.post("/creator/login", {Creator });
    return res.data.data;
  },

  checkEmailExists: async (email: string): Promise<boolean> => {
    const res = await api.post("/creator/check-email", { email });
    return res.data.exists === true;
  },

  register: async (payload: CreatorRegisterPayload) => {
    const res = await api.post("/creator/register", payload);
    return res.data;
  },
  logout:async():Promise<void>=>{
    await api.post("/creator/logout")
  }
};

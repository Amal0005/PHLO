import api from "@/axios/axiosConfig";

export interface CreatorLoginResponse {
  status: "approved" | "pending" | "rejected";
  message?: string;

  creator?:any;
  token?: string;

  reason?: string;
}

export const creatorLoginService = async (
  email: string,
  password: string
): Promise<CreatorLoginResponse> => {
  const res = await api.post("/creator/login", { email, password });
  return res.data.data;
};
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const res = await api.post("/creator/check-email", { email });
  return res.data.exists === true;
};
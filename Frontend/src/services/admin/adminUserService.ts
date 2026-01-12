import api from "@/axios/axiosConfig";

export const fetchAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data.users;
};
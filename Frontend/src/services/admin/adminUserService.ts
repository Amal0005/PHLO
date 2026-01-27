import api from "@/axios/axiosConfig";

export const fetchAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data.users;
};

export const toggleUserStatus = async (userId: string, status: "active" | "blocked") => {
  const response = await api.patch(`/admin/users/${userId}/status`, { status });
  return response.data;
};
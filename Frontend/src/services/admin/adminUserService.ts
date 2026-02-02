import api from "@/axios/axiosConfig";
import { PaginatedResponse } from "@/interface/admin/pagination";
import { User } from "@/interface/admin/userInterface";

export const fetchAdminUsers = async (page: number, limit: number): Promise<PaginatedResponse<User>> => {
  const response = await api.get("/admin/users", {
    params: { page, limit }
  });

  return response.data;
};
export const toggleUserStatus = async (userId: string, status: "active" | "blocked") => {
  const response = await api.patch(`/admin/users/${userId}/status`, { status });
  return response.data;
};
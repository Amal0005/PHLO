import api from "@/axios/axiosConfig";
import { PaginatedResponse } from "@/interface/admin/pagination";
import { User } from "@/interface/admin/userInterface";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const fetchAdminUsers = async (page: number, limit: number): Promise<PaginatedResponse<User>> => {
  const response = await api.get(API_ENDPOINTS.ADMIN.USERS, {
    params: { page, limit }
  });

  return response.data;
};
export const toggleUserStatus = async (userId: string, status: "active" | "blocked") => {
  const response = await api.patch(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/status`, { status });
  return response.data;
};
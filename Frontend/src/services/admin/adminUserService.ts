import api from "@/axios/axiosConfig";
import { PaginatedResponse } from "@/interface/admin/pagination";
import { User } from "@/interface/admin/userInterface";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const fetchAdminUsers = async (page: number, limit: number, search?: string, status?: string): Promise<PaginatedResponse<User>> => {
  const response = await api.get(FRONTEND_ROUTES.ADMIN.USERS, {
    params: { page, limit, search, status }
  });

  return response.data;
};
export const toggleUserStatus = async (userId: string, status: "active" | "blocked") => {
  const response = await api.patch(`${FRONTEND_ROUTES.ADMIN.USERS}/${userId}/status`, { status });
  return response.data;
};

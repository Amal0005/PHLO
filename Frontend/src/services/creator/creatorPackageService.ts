import api from "@/axios/axiosConfig";
import { PackageData } from "@/interface/creator/creatorPackageInterface";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const CreatorPackageService = {
  addPackage: async (data: PackageData) => {
    const res = await api.post(API_ENDPOINTS.CREATOR.PACKAGE, data)
    return res.data
  },
  getPackage: async (params?: { page?: number; limit?: number; search?: string; sortBy?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

    const url = queryParams.toString() ? `${API_ENDPOINTS.CREATOR.PACKAGE}?${queryParams.toString()}` : API_ENDPOINTS.CREATOR.PACKAGE;
    const res = await api.get(url);
    return res.data;
  },
  editPackage: async (packageId: string, data: Partial<PackageData>) => {
    const res = await api.patch(`${API_ENDPOINTS.CREATOR.PACKAGE}/${packageId}`, data);
    return res.data;
  },
  deletePackage: async (packageId: string) => {
    const res = await api.delete(`${API_ENDPOINTS.CREATOR.PACKAGE}/${packageId}`)
    return res.data
  }
}
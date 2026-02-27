import api from "@/axios/axiosConfig";
import { PackageData } from "@/interface/creator/creatorPackageInterface";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const CreatorPackageService = {
  addPackage: async (data: PackageData) => {
    const res = await api.post(API_ENDPOINTS.CREATOR.PACKAGE, data)
    return res.data
  },
  getPackage: async (params?: { page?: number; limit?: number; search?: string; sortBy?: string }) => {
    const res = await api.get(API_ENDPOINTS.CREATOR.PACKAGE, {
      params: { ...params },
    });
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
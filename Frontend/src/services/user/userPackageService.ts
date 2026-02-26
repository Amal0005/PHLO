import api from "@/axios/axiosConfig";
import { PackageFilters, PackageListResponse } from "@/interface/user/userPackageInterface";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const UserPackageService = {
  listPackages: async (filters?: PackageFilters): Promise<PackageListResponse> => {
    const res = await api.get(API_ENDPOINTS.USER.PACKAGES, {
      params: { ...filters },
    });
    return res.data;
  },

  getPackageById: async (packageId: string) => {
    const res = await api.get(`${API_ENDPOINTS.USER.PACKAGES}/${packageId}`);
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get(API_ENDPOINTS.USER.CATEGORY);
    return res.data;
  },
};
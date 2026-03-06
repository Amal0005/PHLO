import api from "@/axios/axiosConfig";
import { PackageFilters, PackageListResponse } from "@/interface/user/userPackageInterface";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const UserPackageService = {
  listPackages: async (filters?: PackageFilters): Promise<PackageListResponse> => {
    const res = await api.get(FRONTEND_ROUTES.USER.PACKAGES, {
      params: { ...filters },
    });
    return res.data;
  },

  getPackageById: async (packageId: string) => {
    const res = await api.get(`${FRONTEND_ROUTES.USER.PACKAGES}/${packageId}`);
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get(FRONTEND_ROUTES.USER.CATEGORY);
    return res.data;
  },
};

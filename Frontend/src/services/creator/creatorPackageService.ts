import api from "@/axios/axiosConfig";
import { PackageData } from "@/interface/creator/creatorPackageInterface";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const CreatorPackageService = {
  addPackage: async (data: PackageData) => {
    const res = await api.post(FRONTEND_ROUTES.CREATOR.PACKAGE, data)
    return res.data
  },
  getPackage: async (params?: { page?: number; limit?: number; search?: string; sortBy?: string }) => {
    const res = await api.get(FRONTEND_ROUTES.CREATOR.PACKAGE, {
      params: { ...params },
    });
    return res.data;
  },
  editPackage: async (packageId: string, data: Partial<PackageData>) => {
    const res = await api.patch(`${FRONTEND_ROUTES.CREATOR.PACKAGE}/${packageId}`, data);
    return res.data;
  },
  deletePackage: async (packageId: string) => {
    const res = await api.delete(`${FRONTEND_ROUTES.CREATOR.PACKAGE}/${packageId}`)
    return res.data
  }
}

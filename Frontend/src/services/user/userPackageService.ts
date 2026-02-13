import api from "@/axios/axiosConfig";
import { PackageFilters, PackageListResponse } from "@/interface/user/userPackageInterface";

export const UserPackageService = {
  listPackages: async (filters?: PackageFilters): Promise<PackageListResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.category) {
      params.append("category", filters.category);
    }
    if (filters?.minPrice !== undefined) {
      params.append("minPrice", filters.minPrice.toString());
    }
    if (filters?.maxPrice !== undefined) {
      params.append("maxPrice", filters.maxPrice.toString());
    }
    if (filters?.creatorId) {
      params.append("creatorId", filters.creatorId);
    }

    const queryString = params.toString();
    const url = queryString ? `/packages?${queryString}` : "/packages";
    
    const res = await api.get(url);
    return res.data;
  },

  // Get single package detail (optional - if you create the backend endpoint)
  getPackageById: async (packageId: string) => {
    const res = await api.get(`/packages/${packageId}`);
    return res.data;
  },
};

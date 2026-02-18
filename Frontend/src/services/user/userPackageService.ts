import api from "@/axios/axiosConfig";
import { PackageFilters, PackageListResponse } from "@/interface/user/userPackageInterface";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const UserPackageService = {
  listPackages: async (filters?: PackageFilters): Promise<PackageListResponse> => {
    const params = new URLSearchParams();

    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.creatorId) params.append("creatorId", filters.creatorId);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.lat !== undefined) params.append("lat", filters.lat.toString());
    if (filters?.lng !== undefined) params.append("lng", filters.lng.toString());
    if (filters?.radiusInKm !== undefined) params.append("radiusInKm", filters.radiusInKm.toString());
    if (filters?.page !== undefined) params.append("page", filters.page.toString());
    if (filters?.limit !== undefined) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.USER.PACKAGES}?${queryString}` : API_ENDPOINTS.USER.PACKAGES;

    const res = await api.get(url);
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

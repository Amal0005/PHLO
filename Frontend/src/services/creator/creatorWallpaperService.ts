import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { AddWallpaperPayload, WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";

export const CreatorWallpaperService = {
  getWallpapers: async (page?: number, limit?: number, filters?: Record<string, unknown>): Promise<PaginatedResponse<WallpaperData>> => {
    const res = await api.get(API_ENDPOINTS.CREATOR.WALLPAPER, {
      params: { page, limit, ...filters }
    });
    return res.data;
  },

  addWallpaper: async (data: AddWallpaperPayload) => {
    const res = await api.post(API_ENDPOINTS.CREATOR.WALLPAPER, data);
    return res.data;
  },

  deleteWallpaper: async (wallpaperId: string) => {
    const res = await api.delete(`${API_ENDPOINTS.CREATOR.WALLPAPER}/${wallpaperId}`);
    return res.data;
  },
};

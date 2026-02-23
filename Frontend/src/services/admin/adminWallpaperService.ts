import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";

export const AdminWallpaperService = {
  getWallpapers: async (page?: number, limit?: number, filters?: Record<string, unknown>): Promise<PaginatedResponse<WallpaperData>> => {
    const res = await api.get(API_ENDPOINTS.ADMIN.WALLPAPERS, {
      params: { page, limit, ...filters }
    });
    return res.data;
  },

  approveWallpaper: async (wallpaperId: string): Promise<void> => {
    await api.patch(`${API_ENDPOINTS.ADMIN.WALLPAPERS}/${wallpaperId}/approve`);
  },

  rejectWallpaper: async (wallpaperId: string, reason: string): Promise<void> => {
    await api.patch(`${API_ENDPOINTS.ADMIN.WALLPAPERS}/${wallpaperId}/reject`, { reason });
  },
};


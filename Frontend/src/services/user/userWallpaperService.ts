import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";

export const UserWallpaperService = {
  getApprovedWallpapers: async (page?: number, limit?: number, filters?: Record<string, unknown>): Promise<PaginatedResponse<WallpaperData>> => {
    const res = await api.get(API_ENDPOINTS.USER.WALLPAPERS, {
      params: { page, limit, ...filters }
    });
    return res.data;
  },

  recordDownload: async (wallpaperId: string, creatorId: string): Promise<{ success: boolean; downloadCount: number }> => {
    const res = await api.post(API_ENDPOINTS.USER.WALLPAPER_DOWNLOAD(wallpaperId), { creatorId });
    return res.data;
  },
};

import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";

export const UserWallpaperService = {
  getApprovedWallpapers: async (page?: number, limit?: number, filters?: Record<string, unknown>): Promise<PaginatedResponse<WallpaperData>> => {
    const res = await api.get(FRONTEND_ROUTES.USER.WALLPAPERS, {
      params: { page, limit, ...filters }
    });
    return res.data;
  },

  recordDownload: async (wallpaperId: string, creatorId: string): Promise<{ success: boolean; downloadCount: number }> => {
    const res = await api.post(FRONTEND_ROUTES.USER.WALLPAPER_DOWNLOAD.replace(':id', wallpaperId), { creatorId });
    return res.data;
  },

  buyWallpaper: async (wallpaperId: string, successUrl: string, cancelUrl: string): Promise<{ success: boolean; url: string; id: string }> => {
    const res = await api.post(FRONTEND_ROUTES.USER.BUY_WALLPAPER.replace(':id', wallpaperId), {
      successUrl,
      cancelUrl,
    });
    return res.data;
  },

  getPurchasedWallpapers: async (page?: number, limit?: number): Promise<PaginatedResponse<WallpaperData>> => {
    const res = await api.get(FRONTEND_ROUTES.USER.WALLPAPERS, {
      params: {
        page,
        limit,
        purchasedOnly: true,
        paidOnly: true,
      },
    });
    return res.data;
  },
};

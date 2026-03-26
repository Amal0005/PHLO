import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";

export const AdminWallpaperService = {
  getWallpapers: async (page?: number, limit?: number, filters?: Record<string, unknown>): Promise<PaginatedResponse<WallpaperData>> => {
    const res = await api.get(FRONTEND_ROUTES.ADMIN.WALLPAPERS, {
      params: { page, limit, ...filters }
    });
    return res.data;
  },

  blockWallpaper: async (wallpaperId: string): Promise<void> => {
    await api.patch(`${FRONTEND_ROUTES.ADMIN.WALLPAPERS}/${wallpaperId}/block`);
  },

  unblockWallpaper: async (wallpaperId: string): Promise<void> => {
    await api.patch(`${FRONTEND_ROUTES.ADMIN.WALLPAPERS}/${wallpaperId}/unblock`);
  },
};


import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { AddWallpaperPayload, WallpaperData } from "@/interface/creator/creatorWallpaperInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";

export const CreatorWallpaperService = {
  getWallpapers: async (page?: number, limit?: number, filters?: Record<string, unknown>): Promise<PaginatedResponse<WallpaperData>> => {
    const res = await api.get(FRONTEND_ROUTES.CREATOR.WALLPAPER, {
      params: { page, limit, ...filters }
    });
    return res.data;
  },

  addWallpaper: async (data: AddWallpaperPayload, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", data.title);
    formData.append("price", data.price.toString());
    formData.append("hashtags", JSON.stringify(data.hashtags));
    
    const res = await api.post(FRONTEND_ROUTES.CREATOR.WALLPAPER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteWallpaper: async (wallpaperId: string) => {
    const res = await api.delete(`${FRONTEND_ROUTES.CREATOR.WALLPAPER}/${wallpaperId}`);
    return res.data;
  },
};

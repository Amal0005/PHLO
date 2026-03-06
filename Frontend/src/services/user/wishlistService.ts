import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const WishlistService = {
    toggle: async (itemId: string, itemType: "wallpaper" | "package"): Promise<{ success: boolean; wishlisted: boolean }> => {
        const res = await api.post(FRONTEND_ROUTES.USER.WISHLIST_TOGGLE, { itemId, itemType });
        return res.data;
    },
    getWishlist: async (params?: { itemType?: string; page?: number; limit?: number }) => {
        const res = await api.get(FRONTEND_ROUTES.USER.WISHLIST, {
            params: { ...params },
        });
        return res.data;
    },
    getWishlistIds: async (itemType: "wallpaper" | "package"): Promise<{ success: boolean; ids: string[] }> => {
        const res = await api.get(FRONTEND_ROUTES.USER.WISHLIST_IDS, {
            params: { itemType },
        });
        return res.data;
    },
};

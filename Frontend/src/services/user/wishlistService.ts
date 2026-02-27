import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const WishlistService = {
    toggle: async (itemId: string, itemType: "wallpaper" | "package"): Promise<{ success: boolean; wishlisted: boolean }> => {
        const res = await api.post(API_ENDPOINTS.USER.WISHLIST_TOGGLE, { itemId, itemType });
        return res.data;
    },
    getWishlist: async (params?: { itemType?: string; page?: number; limit?: number }) => {
        const res = await api.get(API_ENDPOINTS.USER.WISHLIST, {
            params: { ...params },
        });
        return res.data;
    },
    getWishlistIds: async (itemType: "wallpaper" | "package"): Promise<{ success: boolean; ids: string[] }> => {
        const res = await api.get(API_ENDPOINTS.USER.WISHLIST_IDS, {
            params: { itemType },
        });
        return res.data;
    },
};

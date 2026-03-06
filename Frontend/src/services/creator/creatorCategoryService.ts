import api from "@/axios/axiosConfig";
import { Category } from "@/interface/admin/categoryInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const CreatorCategoryService = {
    getCategories: async (page?: number, limit?: number, filters?: Record<string, unknown>): Promise<PaginatedResponse<Category>> => {
        const res = await api.get(FRONTEND_ROUTES.CREATOR.CATEGORY, {
            params: { page, limit, ...filters }
        })
        return res.data
    }
}

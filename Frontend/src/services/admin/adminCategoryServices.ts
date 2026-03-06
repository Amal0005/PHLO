import api from "@/axios/axiosConfig";
import { Category, CategoryForm } from "@/interface/admin/categoryInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";

export const AdminCategoryService = {
    getCategories: async (page?: number, limit?: number, filters?: Record<string, unknown>): Promise<PaginatedResponse<Category>> => {
        const res = await api.get(FRONTEND_ROUTES.ADMIN.CATEGORY, {
            params: { page, limit, ...filters }
        })
        return res.data
    },
    addCategory: async (data: CategoryForm): Promise<Category> => {
        const res = await api.post(FRONTEND_ROUTES.ADMIN.CATEGORY, data)
        return res.data.category
    },
    deleteCategory: async (categoryId: string): Promise<void> => {
        await api.delete(`${FRONTEND_ROUTES.ADMIN.CATEGORY}/${categoryId}`)
    },
    editCategory: async (categoryId: string, data: CategoryForm): Promise<Category> => {
        const res = await api.patch(`${FRONTEND_ROUTES.ADMIN.CATEGORY}/${categoryId}`, data)
        return res.data.category
    }
}

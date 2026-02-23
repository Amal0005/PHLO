import api from "@/axios/axiosConfig";
import { Category, CategoryForm } from "@/interface/admin/categoryInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const AdminCategoryService = {
    getCategories: async (page?: number, limit?: number, filters?: Record<string, unknown>): Promise<PaginatedResponse<Category>> => {
        const res = await api.get(API_ENDPOINTS.ADMIN.CATEGORY, {
            params: { page, limit, ...filters }
        })
        return res.data
    },
    addCategory: async (data: CategoryForm): Promise<Category> => {
        const res = await api.post(API_ENDPOINTS.ADMIN.CATEGORY, data)
        return res.data.category
    },
    deleteCategory: async (categoryId: string): Promise<void> => {
        await api.delete(`${API_ENDPOINTS.ADMIN.CATEGORY}/${categoryId}`)
    },
    editCategory: async (categoryId: string, data: CategoryForm): Promise<Category> => {
        const res = await api.patch(`${API_ENDPOINTS.ADMIN.CATEGORY}/${categoryId}`, data)
        return res.data.category
    }
}
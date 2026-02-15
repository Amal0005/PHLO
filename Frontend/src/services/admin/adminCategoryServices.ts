import api from "@/axios/axiosConfig";
import { Category, CategoryForm } from "@/interface/admin/categoryInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";

export const AdminCategoryService = {
    getCategories: async (page?: number, limit?: number, filters?: any): Promise<PaginatedResponse<Category>> => {
        const res = await api.get("/admin/category", {
            params: { page, limit, ...filters }
        })
        return res.data
    },
    addCategory: async (data: CategoryForm): Promise<Category> => {
        const res = await api.post("/admin/category", data)
        return res.data.category
    },
    deleteCategory: async (categoryId: string): Promise<void> => {
        await api.delete(`/admin/category/${categoryId}`)
    },
    editCategory: async (categoryId: string, data: CategoryForm): Promise<Category> => {
        const res = await api.patch(`/admin/category/${categoryId}`, data)
        return res.data.category
    }
}
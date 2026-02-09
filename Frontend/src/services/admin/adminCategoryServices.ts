import api from "@/axios/axiosConfig";
import { Category, CategoryForm } from "@/interface/admin/categoryInterface";

export const AdminCategoryService ={
    getCategories:async():Promise<Category[]>=>{
        const res=await api.get("/admin/category")
        return res.data.categories
    },
    addCategory:async(data:CategoryForm):Promise<Category>=>{
        const res=await api.post("/admin/category",data)
        return res.data.category
    },
    deleteCategory:async(categoryId:string):Promise<void>=>{
        await api.delete(`/admin/category/${categoryId}`)
    },
    editCategory:async(categoryId:string,data:CategoryForm):Promise<Category>=>{
        const res=await api.patch(`/admin/category/${categoryId}`,data)
        return res.data.category
    }
}
import api from "@/axios/axiosConfig"
import { AdminLoginPayload } from "@/interface/admin/adminLoginInterface"
import { API_ENDPOINTS } from "@/constants/apiEndpoints"


export const AdminAuthService = {
    login: async (payload: AdminLoginPayload) => {
        const res = await api.post(API_ENDPOINTS.ADMIN.LOGIN, payload)
        return res.data
    },
    logOut: async (): Promise<void> => {
        await api.post(API_ENDPOINTS.ADMIN.LOGOUT)
    }
}
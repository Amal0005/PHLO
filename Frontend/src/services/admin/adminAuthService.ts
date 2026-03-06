import api from "@/axios/axiosConfig"
import { AdminLoginPayload } from "@/interface/admin/adminLoginInterface"
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes"


export const AdminAuthService = {
    login: async (payload: AdminLoginPayload) => {
        const res = await api.post(FRONTEND_ROUTES.ADMIN.LOGIN, payload)
        return res.data
    },
    logOut: async (): Promise<void> => {
        await api.post(FRONTEND_ROUTES.ADMIN.LOGOUT)
    }
}

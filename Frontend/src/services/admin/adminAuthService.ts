import api from "@/axios/axiosConfig"
import { AdminLoginPayload } from "@/interface/admin/adminLoginInterface"


export const AdminAuthService={
     login:async(payload:AdminLoginPayload)=>{
        const res=await api.post("/admin/login",payload)
        return res.data
    },
    logOut:async():Promise<void>=>{
        await api.post("/admin/logout")
    }
}
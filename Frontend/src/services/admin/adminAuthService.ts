import api from "@/axios/axiosConfig"

interface AdminLoginPayload {
    email :string,
    password:string
}
export const AdminAuthService={
     login:async(payload:AdminLoginPayload)=>{
        const res=await api.post("/admin/login",payload)
        return res.data
    }
}
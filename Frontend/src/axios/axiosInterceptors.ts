import { store } from "@/store/store"
import api from "./axiosConfig"
import { clearAuth } from "@/store/tokenSlice"

export const setUpInterceptors=()=>{
    api.interceptors.request.use((config)=>{
        const {token}=store.getState().token
        if(token&&config.headers){
config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })


    api.interceptors.response.use(
        (res)=>res,
        (err)=>{
            const status=err.response?.status;
            if(status==401){
                store.dispatch(clearAuth())
                window.location.href="/login"
            }
            return Promise.reject(err)
        }
    )
}


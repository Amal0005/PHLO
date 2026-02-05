import api from "@/axios/axiosConfig";
import { EditProfilePayload, UserProfileResponse } from "@/interface/user/userProfileInterface";

export const UserProfileService={
    getProfile:async():Promise<{success:boolean;user:UserProfileResponse}>=>{
        const res=await api.get("/profile")
        return res.data
    },
    editProfile:async(payload:EditProfilePayload):Promise<{success:boolean,user:UserProfileResponse}>=>{
        const res=await api.patch("/profile",payload)
        return res.data
    }
}
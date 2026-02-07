import api from "@/axios/axiosConfig";
import { CreatorProfileResponse, EditCreatorProfilePayload } from "@/interface/creator/creatorProfileInterface";

export const CreatorProfileServices={
    getProfile:async():Promise<{success:boolean,creator:CreatorProfileResponse}>=>{
        const res=await api.get("/creator/profile")
        return res.data
    },
    editProfile:async(payload:EditCreatorProfilePayload):Promise<{success:boolean,creator:CreatorProfileResponse}>=>{
        const res=await api.patch("/creator/profile",payload)
        return res.data
    }
}
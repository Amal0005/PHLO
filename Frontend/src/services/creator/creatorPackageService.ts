import api from "@/axios/axiosConfig";
import { PackageData } from "@/interface/creator/creatorPackageInterface";

export const CreatorPackageService={
    addPackage:async (data:PackageData)=>{
      const res= await api.post("/creator/package",data)
        return res.data
    },
    getPackage:async()=>{
      const res=await api.get("/creator/package")
      return res.data
    }
}
import api from "@/axios/axiosConfig";
import { Creator } from "@/interface/admin/creatorInterface";

export const fetchAdminCreators = async (): Promise<Creator[]> => {
  const res = await api.get("/admin/creators");
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (Array.isArray(res.data.creators)) {
    return res.data.creators;
  }
  if (Array.isArray(res.data.data)) {
    return res.data.data;
  }
  return [];
};

export const approveCreator = async (
  creatorId: string
): Promise<void> => {
  await api.patch(`/admin/creators/${creatorId}/approve`);
};

export const rejectCreator = async (
  creatorId: string,
  reason: string
): Promise<void> => {
  await api.patch(`/admin/creators/${creatorId}/reject`, { reason });
};
export const toggleCreatorStatus=async(creatorId:string,status:"approved"|"blocked")=>{
  const response=await api.patch(`/admin/creators/${creatorId}/status`, { status });
  return response.data
}

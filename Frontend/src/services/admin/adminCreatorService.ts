import api from "@/axios/axiosConfig";
import { Creator } from "@/interface/admin/creatorInterface";
import { PaginatedResponse } from "@/interface/admin/pagination";

export const fetchAdminCreators = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<Creator>> => {

  const res = await api.get("/admin/creators", {
    params: { page, limit }
  });

  return res.data;
};

export const approveCreator = async (creatorId: string): Promise<void> => {
  await api.patch(`/admin/creators/${creatorId}/approve`);
};

export const rejectCreator = async (creatorId: string,reason: string): Promise<void> => {
  await api.patch(`/admin/creators/${creatorId}/reject`, { reason });
};
export const toggleCreatorStatus=async(creatorId:string,status:"approved"|"blocked")=>{
  const response=await api.patch(`/admin/creators/${creatorId}/status`, { status });
  return response.data
}

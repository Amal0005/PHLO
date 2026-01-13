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
  creatorId: string
): Promise<void> => {
  await api.patch(`/admin/creators/${creatorId}/reject`);
};

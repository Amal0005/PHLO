import api from "@/axios/axiosConfig";

// GET all creators
export const fetchAdminCreators = async () => {
  const res = await api.get("/admin/creators");
  console.log("ADMIN CREATORS RESPONSE:", res.data);

  return res.data;
};

// APPROVE creator
export const approveCreator = async (creatorId: string) => {
  await api.patch(`/admin/creators/${creatorId}/approve`);
};

// REJECT creator
export const rejectCreator = async (creatorId: string) => {
  await api.patch(`/admin/creators/${creatorId}/reject`);
};

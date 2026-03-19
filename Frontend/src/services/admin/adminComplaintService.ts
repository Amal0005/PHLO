import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { Complaint, PaginatedComplaintResponse } from "@/interface/admin/AdminComplaintInterface";

export const AdminComplaintService = {
  getAllComplaints: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string
  ): Promise<PaginatedComplaintResponse> => {
    const res = await api.get(FRONTEND_ROUTES.ADMIN.COMPLAINTS, {
      params: { page, limit, search, status }
    });
    return res.data;
  },

  resolveComplaint: async (id: string, action: "resolve" | "dismiss", adminComment: string): Promise<Complaint> => {
    const res = await api.patch(FRONTEND_ROUTES.ADMIN.RESOLVE_COMPLAINT.replace(":id", id), {
      action,
      adminComment,
    });
    return res.data;
  },

  rejectComplaint: async (id: string, adminComment: string): Promise<Complaint> => {
    const res = await api.patch(FRONTEND_ROUTES.ADMIN.REJECT_COMPLAINT.replace(":id", id), {
      adminComment,
    });
    return res.data;
  },
};

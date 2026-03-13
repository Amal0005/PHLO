import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { Complaint } from "@/interface/admin/AdminComplaintInterface";

export const AdminComplaintService = {
  getAllComplaints: async (): Promise<Complaint[]> => {
    const res = await api.get(FRONTEND_ROUTES.ADMIN.COMPLAINTS);
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

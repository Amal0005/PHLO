import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { ComplaintRequest, Complaint } from "@/interface/user/userComplaintInterface";

export const UserComplaintService = {
  registerComplaint: async (complaintData: ComplaintRequest): Promise<unknown> => {
    const res = await api.post(FRONTEND_ROUTES.USER.COMPLAINTS, complaintData);
    return res.data;
  },

  getComplaintByBooking: async (bookingId: string): Promise<Complaint | null> => {
    const res = await api.get(FRONTEND_ROUTES.USER.GET_COMPLAINT_BY_BOOKING.replace(":id", bookingId));
    return res.data;
  },
};

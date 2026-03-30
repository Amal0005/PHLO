import api from "@/axios/axiosConfig";
import { ICreatorLeaveService, LeaveResponse } from "@/interface/creator/creatorLeaveInterface";
import { format } from "date-fns";

export const creatorLeaveService: ICreatorLeaveService = {
  getLeaves: async (): Promise<LeaveResponse[]> => {
    const response = await api.get("/creator/leave");
    return response.data;
  },
  addLeave: async (date: Date): Promise<LeaveResponse> => {
    const dateStr = format(date, "yyyy-MM-dd");
    const response = await api.post("/creator/leave", { date: dateStr });
    return response.data;
  },
  removeLeave: async (date: Date): Promise<boolean> => {
    const dateStr = format(date, "yyyy-MM-dd");
    const response = await api.delete(`/creator/leave/${dateStr}`);
    return response.data;
  }
};

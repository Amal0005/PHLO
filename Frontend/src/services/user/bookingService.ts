import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { CreateBookingResponse } from "@/interface/user/CreateBookingResponse";
import { BookingListResponse } from "@/interface/user/userBookingInterface";

export const BookingService = {
  createBooking: async (
    packageId: string,
    baseUrl: string,
  ): Promise<CreateBookingResponse> => {
    const res = await api.post(API_ENDPOINTS.USER.CREATE_BOOKING, {
      packageId,
      baseUrl,
    });
    return res.data;
  },
  getUserBookings: async (): Promise<BookingListResponse> => {
    const res = await api.get("/bookings");
    return res.data;
  },

};

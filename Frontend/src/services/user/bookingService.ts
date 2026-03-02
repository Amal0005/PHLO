import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { CreateBookingResponse } from "@/interface/user/CreateBookingResponse";
import { BookingListResponse } from "@/interface/user/userBookingInterface";

export const BookingService = {

  createBooking: async (packageId: string, baseUrl: string, bookingDate: string): Promise<CreateBookingResponse> => {
    const res = await api.post(API_ENDPOINTS.USER.CREATE_BOOKING, {
      packageId,
      baseUrl,
      bookingDate,
    });
    return res.data;
  },
  getUserBookings: async (): Promise<BookingListResponse> => {
    const res = await api.get(API_ENDPOINTS.USER.GET_BOOKINGS);
    return res.data;
  },
  checkAvailability: async (packageId: string, date: string): Promise<{ success: boolean; isAvailable: boolean }> => {
    const res = await api.get(`${API_ENDPOINTS.USER.CHECK_AVAILABILITY}?packageId=${packageId}&date=${date}`);
    return res.data;
  },
  getBookingStatus: async (sessionId: string): Promise<{ status: string }> => {
    const res = await api.get(API_ENDPOINTS.USER.GET_BOOKING_STATUS(sessionId));
    return res.data;
  },
  cancelBooking: async (sessionId: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(API_ENDPOINTS.USER.CANCEL_BOOKING(sessionId));
    return res.data;
  },
}

import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { CreateBookingResponse } from "@/interface/user/CreateBookingResponse";
import { BookingListResponse, UserBooking } from "@/interface/user/userBookingInterface";

export const BookingService = {

  createBooking: async (packageId: string, baseUrl: string, bookingDate: string, location?: string): Promise<CreateBookingResponse> => {
    const res = await api.post(API_ENDPOINTS.USER.CREATE_BOOKING, {
      packageId,
      baseUrl,
      bookingDate,
      location,
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
  getBookingDetail: async (sessionId: string): Promise<{ success: boolean; data: UserBooking }> => {
    const res = await api.get(API_ENDPOINTS.USER.GET_BOOKING_DETAIL.replace(':id', sessionId));
    return res.data;
  },
  cancelBooking: async (sessionId: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(API_ENDPOINTS.USER.CANCEL_BOOKING.replace(':id', sessionId));
    return res.data;
  },
  downloadInvoice: async (sessionId: string): Promise<void> => {
    const { data } = await api.get(API_ENDPOINTS.USER.DOWNLOAD_INVOICE.replace(':id', sessionId), {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${sessionId.slice(0, 8)}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  },
}

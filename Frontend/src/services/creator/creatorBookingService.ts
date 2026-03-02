import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { BookingListResponse } from "@/interface/user/userBookingInterface";

export const CreatorBookingService = {
    getCreatorBookings: async (): Promise<BookingListResponse> => {
        const res = await api.get(API_ENDPOINTS.CREATOR.GET_BOOKINGS);
        return res.data;
    },
};

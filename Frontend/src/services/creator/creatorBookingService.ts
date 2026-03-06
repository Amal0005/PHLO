import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { BookingListResponse } from "@/interface/user/userBookingInterface";

export const CreatorBookingService = {
    getCreatorBookings: async (): Promise<BookingListResponse> => {
        const res = await api.get(FRONTEND_ROUTES.CREATOR.GET_BOOKINGS);
        return res.data;
    },
};

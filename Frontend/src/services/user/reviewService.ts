import api from "@/axios/axiosConfig";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { AddReviewRequest, ReviewListResponse, Review } from "@/interface/user/reviewInterface";

export const ReviewService = {
    addReview: async (data: AddReviewRequest): Promise<{ success: boolean; message: string }> => {
        const res = await api.post(FRONTEND_ROUTES.USER.ADD_REVIEW, data);
        return res.data;
    },
    getPackageReviews: async (packageId: string): Promise<ReviewListResponse> => {
        const res = await api.get(FRONTEND_ROUTES.USER.GET_REVIEWS.replace(':id', packageId));
        return res.data;
    },
    deleteReview: async (reviewId: string): Promise<{ success: boolean; message: string }> => {
        const res = await api.delete(FRONTEND_ROUTES.USER.DELETE_REVIEW.replace(':id', reviewId));
        return res.data;
    },
    updateReview: async (reviewId: string, data: { rating: number; comment: string }): Promise<{ success: boolean; message: string }> => {
        const res = await api.put(FRONTEND_ROUTES.USER.UPDATE_REVIEW.replace(':id', reviewId), data);
        return res.data;
    },
    getBookingReview: async (bookingId: string): Promise<{ success: boolean; data: Review | null }> => {
        const res = await api.get(FRONTEND_ROUTES.USER.GET_BOOKING_REVIEW.replace(':id', bookingId));
        return res.data;
    }
};

import api from "@/axios/axiosConfig";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { AddReviewRequest, ReviewListResponse, Review } from "@/interface/user/reviewInterface";

export const ReviewService = {
    addReview: async (data: AddReviewRequest): Promise<{ success: boolean; message: string }> => {
        const res = await api.post(API_ENDPOINTS.USER.ADD_REVIEW, data);
        return res.data;
    },
    getPackageReviews: async (packageId: string): Promise<ReviewListResponse> => {
        const res = await api.get(API_ENDPOINTS.USER.GET_REVIEWS.replace(':id', packageId));
        return res.data;
    },
    deleteReview: async (reviewId: string): Promise<{ success: boolean; message: string }> => {
        const res = await api.delete(API_ENDPOINTS.USER.DELETE_REVIEW.replace(':id', reviewId));
        return res.data;
    },
    getBookingReview: async (bookingId: string): Promise<{ success: boolean; data: Review | null }> => {
        const res = await api.get(`/review/booking/${bookingId}`); // I'll use a hardcoded path for now to be safe, or update apiEndpoints
        return res.data;
    }
};

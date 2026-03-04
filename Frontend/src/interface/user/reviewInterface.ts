export interface Review {
    id: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    packageId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewListResponse {
    success: boolean;
    data: Review[];
}

export interface AddReviewRequest {
    packageId: string;
    bookingId: string;
    rating: number;
    comment: string;
}

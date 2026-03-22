export interface CreatorResponseDto {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profilePhoto?: string;
    city: string;
    yearsOfExperience: number;
    bio: string;
    portfolioLink?: string;
    governmentId: string;
    status: "pending" | "approved" | "rejected" | "blocked";
    rejectionReason?: string;
    specialties: string[];
    isSubscribed?: boolean;
    createdAt: Date;
    updatedAt: Date;
    subscription?: {
        planId: string;
        planName: string;
        status: "active" | "expired" | "cancelled";
        startDate: string | Date;
        endDate: string | Date;
        stripeSessionId?: string;
    };
    upcomingSubscription?: {
        planId: string;
        planName: string;
        status: "active" | "expired" | "cancelled";
        startDate: string | Date;
        endDate: string | Date;
        stripeSessionId?: string;
    };
}

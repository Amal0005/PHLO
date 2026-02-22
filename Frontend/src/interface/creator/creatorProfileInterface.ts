export interface CreatorProfileResponse {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  city: string;
  yearsOfExperience: number;
  bio: string;
  portfolioLink?: string;
  specialties?: string[];
  status: string;
  isSubscribed: boolean;
  subscription?: {
    planId: string;
    planName: string;
    status: "active" | "expired" | "cancelled";
    startDate: string;
    endDate: string;
    stripeSessionId: string;
  };
}
export interface EditCreatorProfilePayload {
  fullName?: string;
  phone?: string;
  profilePhoto?: string;
  city?: string;
  yearsOfExperience?: number;
  bio?: string;
  portfolioLink?: string;
  specialties?: string[];
}
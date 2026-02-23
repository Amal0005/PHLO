export interface Creator {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: "pending" | "approved" | "rejected" | "blocked";
  createdAt?: string;
  profilePhoto?: string;
  governmentId?: string;
  bio?: string;
  yearsOfExperience?: string;
  portfolioLink?: string;
  specialties?: string[];
  subscription?: {
    planId: string;
    planName: string;
    status: "active" | "expired" | "cancelled";
    startDate: string;
    endDate: string;
    stripeSessionId: string;
  };
}

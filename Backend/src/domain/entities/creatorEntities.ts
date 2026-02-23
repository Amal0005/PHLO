export interface SubscriptionDetails {
  planId: string;
  planName: string;
  status: "active" | "expired" | "cancelled";
  startDate: Date;
  endDate: Date;
  stripeSessionId: string;
}

export interface CreatorEntity {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  profilePhoto?: string;
  city: string;
  yearsOfExperience: number;
  bio: string;
  portfolioLink?: string;
  governmentId: string;
  status: "pending" | "approved" | "rejected" | "blocked";
  rejectionReason?: string;
  specialties?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  subscription?: SubscriptionDetails;
}

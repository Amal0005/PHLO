export interface Creator {
  _id: string;
  fullName: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
    profilePhoto?: string;
  governmentId?: string;
  bio?: string;
  experience?: string;
  portfolioLink?: string;
}

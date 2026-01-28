export interface Creator {
  _id: string;
  fullName: string;
  email: string;
status: "pending" | "approved" | "rejected" | "blocked";
  createdAt?: string;
    profilePhoto?: string;
  governmentId?: string;
  bio?: string;
  yearsOfExperience?: string;
  portfolioLink?: string;
    specialties?: string[];

}

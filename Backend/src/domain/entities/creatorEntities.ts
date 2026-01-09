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
  status: "pending" | "approved" | "rejected";
  specialties?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

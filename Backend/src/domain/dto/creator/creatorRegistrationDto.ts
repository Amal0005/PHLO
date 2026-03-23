export interface CreatorRegistrationDto {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  yearsOfExperience: number;
  bio: string;
  governmentId: string;
  profilePhoto?: string;
  portfolioLink?: string;
  specialties?: string[];
}

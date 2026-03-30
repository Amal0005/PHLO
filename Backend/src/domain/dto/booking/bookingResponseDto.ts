import type { BookingStatus } from "@/constants/bookingStatus";

export interface BookingResponseDTO {
  id: string;
  userId: string;
  userDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
  packageId: string;
  creatorId: string;
  packageDetails?: {
    title: string;
    description: string;
    images: string[];
    price: number;
    category: string;
  };
  amount: number;
  currency: string;
  status: BookingStatus;
  bookingDate: Date;
  location?: string;
  createdAt: Date;
  sessionId: string;
  checkoutUrl?: string;
}

import { BookingStatus } from "@/utils/bookingStatus";

export interface BookingResponseDTO {
  id: string;
  userId: string;
  packageId: string;
  packageDetails?: {
    title: string;
    description: string;
    images: string[];
  };
  amount: number;
  status: BookingStatus;
  createdAt: Date;
}

import { BookingStatus } from "@/constants/bookingStatus";
import { PackageEntity } from "./packageEntity";
import { User } from "./userEntities";

export interface BookingEntity {
  id?: string;
  userId: string | User;
  packageId: string | PackageEntity;
  amount: number;
  currency: "inr";
  bookingDate: Date;
  status: BookingStatus;
  stripeSessionId?: string;
  location?: string;
  paymentStatus?: "held" | "released" | "refunded";
  createdAt?: Date;
  updatedAt?: Date;
}

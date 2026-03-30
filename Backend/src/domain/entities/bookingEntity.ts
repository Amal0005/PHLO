import type { BookingStatus } from "@/constants/bookingStatus";
import type { PackageEntity } from "@/domain/entities/packageEntity";
import type { User } from "@/domain/entities/userEntities";

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
  paymentStatus?: "held" | "released" | "refunded" | "partially_refunded";
  createdAt?: Date;
  updatedAt?: Date;
}

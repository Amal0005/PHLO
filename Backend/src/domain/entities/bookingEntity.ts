import { BookingStatus } from "@/utils/bookingStatus";
import { PackageEntity } from "./packageEntity";

export interface BookingEntity {
  id?: string;
  userId: string;
  packageId: string | PackageEntity;
  amount: number;
  currency: "inr";
  status: BookingStatus;
  stripeSessionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

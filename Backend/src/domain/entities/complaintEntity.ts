import type { User } from "@/domain/entities/userEntities";
import type { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface ComplaintEntity {
  _id?: string;
  userId: string | User;
  creatorId: string | CreatorEntity;
  bookingId: string;
  reason: string;
  description: string;
  status: "pending" | "resolved" | "dismissed";
  adminComment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

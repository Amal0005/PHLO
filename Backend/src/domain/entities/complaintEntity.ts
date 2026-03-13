import { User } from "./userEntities";
import { CreatorEntity } from "./creatorEntities";

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

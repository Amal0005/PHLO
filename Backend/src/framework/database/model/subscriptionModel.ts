import type { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import { subscriptionSchema } from "@/framework/database/schema/subscriptionSchema";

export interface ISubscriptionModel extends Omit<SubscriptionEntity, "_id">, Document {
  _id: Types.ObjectId;
}

export const SubscriptionModel = model<ISubscriptionModel>("Subscription", subscriptionSchema);

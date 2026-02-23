import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { model, Document, Types } from "mongoose";
import { subscriptionSchema } from "../schema/subscriptionSchema";

export interface ISubscriptionModel extends Omit<SubscriptionEntity, "_id">, Document {
  _id: Types.ObjectId;
}

export const SubscriptionModel = model<ISubscriptionModel>("Subscription", subscriptionSchema);

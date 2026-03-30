import { bookingSchema } from "@/framework/database/schema/bookingSchema";
import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { BookingEntity } from "@/domain/entities/bookingEntity";

export interface BookingDocument extends Document, Omit<BookingEntity, 'id'> {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const BookingModel = model<BookingDocument>("booking", bookingSchema);

import { bookingSchema } from "../schema/bookingSchema";
import { model, Document, Types } from "mongoose";
import { BookingEntity } from "@/domain/entities/bookingEntity";

export interface BookingDocument extends Document, Omit<BookingEntity, 'id'> {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const BookingModel = model<BookingDocument>("booking", bookingSchema);

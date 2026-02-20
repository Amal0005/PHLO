import { bookingSchema } from "../schema/bookingSchema";
import { model, Document } from "mongoose";
import { BookingEntity } from "@/domain/entities/bookingEntity";

export interface BookingDocument extends Document, Omit<BookingEntity, 'id'> {
    _id: any;
    createdAt: Date;
    updatedAt: Date;
}

export const BookingModel = model<BookingDocument>("booking", bookingSchema);

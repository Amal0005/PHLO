import { Schema } from "mongoose";

const subscriptionDetailsSchema = new Schema({
  planId: { type: Schema.Types.ObjectId, ref: "subscription", required: true },
  planName: { type: String, required: true },
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  stripeSessionId: { type: String, required: true },
}, { _id: false });


export const creatorSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      default: "creator",
    },
    phone: { type: String, required: true },

    password: { type: String, required: true },

    profilePhoto: { type: String },

    city: { type: String, required: true },

    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },

    bio: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 300,
    },

    portfolioLink: { type: String },

    governmentId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    specialties: [{ type: String }],
    subscription: subscriptionDetailsSchema,
  },
  { timestamps: true },

);

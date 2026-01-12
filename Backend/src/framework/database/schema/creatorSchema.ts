import { Schema } from "mongoose";

export const creatorSchema = new Schema(
  {
    fullName: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
      minlength: 100,
      maxlength: 300,
    },

    portfolioLink: { type: String },

    governmentId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    specialties: [{ type: String }],
  },
  { timestamps: true }
);

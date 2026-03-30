import type { Document, Types } from "mongoose";
import { model } from "mongoose";
import type { LeaveEntity } from "@/domain/entities/leaveEntity";
import { leaveSchema } from "@/framework/database/schema/leaveSchema";

export interface ILeaveModel extends Omit<LeaveEntity, "id">, Document {
  _id: Types.ObjectId;
}

export const LeaveModel = model<ILeaveModel>("Leave", leaveSchema);
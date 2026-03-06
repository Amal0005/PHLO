import { model, Document, Types } from "mongoose";
import { LeaveEntity } from "@/domain/entities/leaveEntity";
import { leaveSchema } from "../schema/leaveSchema";

export interface ILeaveModel extends Omit<LeaveEntity, "id">, Document {
  _id: Types.ObjectId;
}

export const LeaveModel = model<ILeaveModel>("Leave", leaveSchema);
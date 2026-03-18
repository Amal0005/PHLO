import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { ComplaintModel } from "@/framework/database/model/complaintModel";
import { ComplaintMapper } from "@/application/mapper/user/complaintMapper";

export class ComplaintRepository implements IComplaintRepository {
  async create(complaint: ComplaintEntity): Promise<ComplaintEntity> {
    const newComplaint = await ComplaintModel.create(complaint);
    return ComplaintMapper.toEntity(newComplaint.toObject() as unknown as Record<string, unknown>);
  }

  async findAll(): Promise<ComplaintEntity[]> {
    const complaints = await ComplaintModel.find()
      .populate("userId creatorId")
      .sort({ createdAt: -1 })
      .lean();
    return ComplaintMapper.toEntityList(complaints as unknown as Record<string, unknown>[]);
  }

  async findById(id: string): Promise<ComplaintEntity | null> {
    const complaint = await ComplaintModel.findById(id).lean();
    return complaint ? ComplaintMapper.toEntity(complaint as unknown as Record<string, unknown>) : null;
  }

  async update(complaint: ComplaintEntity): Promise<ComplaintEntity | null> {
    const { _id, userId, creatorId, ...rest } = complaint;
    
    const updateData: any = { ...rest };
    if (userId) updateData.userId = typeof userId === 'object' ? (userId as any)._id || (userId as any).id : userId;
    if (creatorId) updateData.creatorId = typeof creatorId === 'object' ? (creatorId as any)._id || (creatorId as any).id : creatorId;

    const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    ).lean();
    
    return updatedComplaint ? ComplaintMapper.toEntity(updatedComplaint as unknown as Record<string, unknown>) : null;
  }
  async findByBookingId(bookingId: string): Promise<ComplaintEntity | null> {
    const complaint = await ComplaintModel.findOne({ bookingId }).lean();
    return complaint ? ComplaintMapper.toEntity(complaint as unknown as Record<string, unknown>) : null;
  }
}

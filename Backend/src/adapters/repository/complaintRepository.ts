import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { ComplaintModel } from "@/framework/database/model/complaintModel";
import { ComplaintMapper } from "@/application/mapper/user/complaintMapper";

export class ComplaintRepository implements IComplaintRepository {
  async create(complaint: ComplaintEntity): Promise<ComplaintEntity> {
    const newComplaint = await ComplaintModel.create(complaint);
    return ComplaintMapper.toEntity(newComplaint.toObject());
  }

  async findAll(): Promise<ComplaintEntity[]> {
    const complaints = await ComplaintModel.find()
      .populate("userId creatorId")
      .sort({ createdAt: -1 })
      .lean();
    return ComplaintMapper.toEntityList(complaints);
  }

  async findById(id: string): Promise<ComplaintEntity | null> {
    const complaint = await ComplaintModel.findById(id).lean();
    return complaint ? ComplaintMapper.toEntity(complaint) : null;
  }

  async update(complaint: ComplaintEntity): Promise<ComplaintEntity | null> {
    const { _id, ...updateData } = complaint;
    const updatedComplaint = await ComplaintModel.findByIdAndUpdate(_id, updateData, { new: true }).lean();
    return updatedComplaint ? ComplaintMapper.toEntity(updatedComplaint) : null;
  }
}

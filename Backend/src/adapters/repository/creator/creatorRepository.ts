import { CreatorEntity } from "../../../domain/entities/creatorEntities";
import { IcreatorRepository } from "../../../domain/interface/creator/IcreatorRepository";
import { CreatorModel } from "../../../framework/database/model/creatorModel"

export class CreatorRepository implements IcreatorRepository{
    
  private toDomain(doc: any): CreatorEntity {
    return {
      ...doc,
      _id: doc._id.toString(),
    };
  }

  async findByEmail(email: string): Promise<CreatorEntity | null> {
      const creator=await CreatorModel.findOne({email})
      return creator?this.toDomain(creator.toObject()):null
  }

 async createCreator(creator: Omit<CreatorEntity, "_id">): Promise<CreatorEntity> {
    const created = await CreatorModel.create(creator);
    return this.toDomain(created.toObject());
  }

  async updateStatus(creatorId: string, status: "approved" | "rejected"): Promise<void> {
    await CreatorModel.updateOne(
      { _id: creatorId },
      { $set: { status } }
    );

}
}
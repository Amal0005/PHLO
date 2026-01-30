import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { CreatorModel } from "@/framework/database/model/creatorModel";

export class CreatorRepository implements IcreatorRepository {
  private toDomain(doc: any): CreatorEntity {
    return {
      _id: doc._id.toString(),
      fullName: doc.fullName,
      email: doc.email,
      password: doc.password,
      phone: doc.phone,
      profilePhoto: doc.profilePhoto,
      city: doc.city,
      yearsOfExperience: doc.yearsOfExperience,
      bio: doc.bio,
      portfolioLink: doc.portfolioLink,
      governmentId: doc.governmentId,
      status: doc.status,
      rejectionReason: doc.rejectionReason,
      specialties: doc.specialties,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<CreatorEntity | null> {
    const creator = await CreatorModel.findOne({ email });
    return creator ? this.toDomain(creator.toObject()) : null;
  }
  async findByPhone(phone: string): Promise<CreatorEntity | null> {
    const creator = await CreatorModel.findOne({ phone });
    return creator ? this.toDomain(creator.toObject()) : null;
  }
  async createCreator(
    creator: Omit<CreatorEntity, "_id">,
  ): Promise<CreatorEntity> {
    const created = await CreatorModel.create(creator);
    return this.toDomain(created.toObject());
  }

  async updateStatus(
    creatorId: string,
    status: "approved" | "rejected" | "blocked",
    reason?: string,
  ): Promise<void> {
    await CreatorModel.updateOne(
      { _id: creatorId },
      { $set: { status, rejectionReason: reason } },
    );
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await CreatorModel.updateOne(
      { email },
      { $set: { password: hashedPassword } },
    );
  }
  async findAllCreators(): Promise<CreatorEntity[]> {
    const creators = await CreatorModel.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return creators.map((c) => this.toDomain(c));
  }
  async findById(id: string): Promise<CreatorEntity | null> {
    return await CreatorModel.findById(id);
  }
}

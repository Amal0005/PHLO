import { CreatorMapper } from "@/adapters/mapper/creator/creatorMapper";
import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { ICreatorRepository } from "@/domain/interface/creator/ICreatorRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { CreatorModel } from "@/framework/database/model/creatorModel";
import { paginateMongo } from "@/utils/pagination";

export class CreatorRepository implements ICreatorRepository {


  async findByEmail(email: string): Promise<CreatorEntity | null> {
    const creator = await CreatorModel.findOne({ email });
    return creator ? CreatorMapper.toDomain(creator) : null;
  }
  async findByPhone(phone: string): Promise<CreatorEntity | null> {
    const creator = await CreatorModel.findOne({ phone });
    return creator ? CreatorMapper.toDomain(creator) : null;
  }
  async createCreator(
    creator: Omit<CreatorEntity, "_id">,
  ): Promise<CreatorEntity> {
    const created = await CreatorModel.create(creator);
    return CreatorMapper.toDomain(created.toObject());
  }

  async updateStatus(
    creatorId: string,
    status: "pending" | "approved" | "rejected" | "blocked",
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

async findAllCreators(page: number,limit: number): Promise<PaginatedResult<CreatorEntity>> {
  const result = await paginateMongo(
    CreatorModel,
    {},
    page,
    limit,
    {
      select: "-password",
      sort: { createdAt: -1 }
    }
  );
  return {
    ...result,
    data: result.data.map((c: any) =>
        CreatorMapper.toDomain(c)
    )
  };
}

async findById(id: string): Promise<CreatorEntity | null> {
  const creator = await CreatorModel.findById(id);
    return creator ? CreatorMapper.toDomain(creator) : null;
  }
  async updateProfile(creatorId: string, data: Partial<CreatorEntity>): Promise<CreatorEntity | null> {
    const creator=await CreatorModel.findByIdAndUpdate(
      creatorId,
      {$set:data},
      {new:true}
    )
    return creator?CreatorMapper.toDomain(creator):null
  }
}


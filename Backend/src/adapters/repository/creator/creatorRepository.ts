import { CreatorMapper } from "@/application/mapper/creator/creatorMapper";
import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { CreatorModel, ICreatorModel } from "@/framework/database/model/creatorModel";
import { paginateMongo } from "@/utils/pagination";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { BaseRepository } from "../baseRepository";
import { Filter } from "mongodb";


export class CreatorRepository extends BaseRepository<CreatorEntity, ICreatorModel> implements ICreatorRepository {
  constructor() {
    super(CreatorModel);
  }

  protected mapToEntity(doc: ICreatorModel): CreatorEntity {
    return CreatorMapper.toDomain(doc);
  }



  async findByEmail(email: string): Promise<CreatorEntity | null> {
    const creator = await this.model.findOne({ email });
    return creator ? this.mapToEntity(creator) : null;
  }

  async findByPhone(phone: string | undefined): Promise<CreatorEntity | null> {
    if (!phone) return null;
    const creator = await this.model.findOne({ phone });
    return creator ? this.mapToEntity(creator) : null;
  }

  async createCreator(creator: Omit<CreatorEntity, "_id">): Promise<CreatorEntity> {
    const created = await this.model.create(creator as unknown as Omit<ICreatorModel, keyof Document>);
    return this.mapToEntity(created as ICreatorModel);
  }

  async updateStatus(creatorId: string, status: "pending" | "approved" | "rejected" | "blocked", reason?: string): Promise<void> {
    await this.model.updateOne({ _id: creatorId }, { $set: { status, rejectionReason: reason } });
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.model.updateOne({ email }, { $set: { password: hashedPassword } });
  }

  async findAllCreators(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<CreatorEntity>> {
    const query: Filter<ICreatorModel> = {};
    if (status && status !== "all") {
      query.status = status as "pending" | "approved" | "rejected" | "blocked";
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    const result = await paginateMongo(this.model, query, page, limit, { select: "-password", sort: { createdAt: -1 } });
    return { ...result, data: result.data.map((c: ICreatorModel) => this.mapToEntity(c)) };
  }

  async updateProfile(creatorId: string, data: Partial<CreatorEntity>): Promise<CreatorEntity | null> {
    const creator = await this.model.findByIdAndUpdate(creatorId, { $set: data }, { new: true });
    return creator ? this.mapToEntity(creator) : null;
  }
}

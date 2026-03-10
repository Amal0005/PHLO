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

  async activateUpcomingSubscription(creatorId: string): Promise<void> {
    await this.model.updateOne(
      { _id: creatorId },
      [{ $set: { subscription: "$upcomingSubscription", upcomingSubscription: "$$REMOVE" } }]
    );
  }

  async findCreatorsWithExpiredSubscriptions(): Promise<CreatorEntity[]> {
    const now = new Date();
    const docs = await this.model.find({
      "subscription.status": "active",
      "subscription.endDate": { $lte: now },
      upcomingSubscription: { $exists: true, $ne: null },
    }).select("-password");
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async expireSubscriptions(): Promise<void> {
    const now = new Date();
    await this.model.updateMany(
      {
        "subscription.status": "active",
        "subscription.endDate": { $lte: now },
        upcomingSubscription: { $exists: false }
      },
      {
        $set: { "subscription.status": "expired" }
      }
    );
  }

  async updateSubscriptionStatus(creatorId: string, status: "active" | "expired" | "cancelled"): Promise<void> {
    await this.model.updateOne(
      { _id: creatorId },
      { $set: { "subscription.status": status } }
    );
  }

  protected mapToEntity(doc: ICreatorModel): CreatorEntity {
    return {
      _id: doc._id?.toString(),
      fullName: doc.fullName,
      email: doc.email,
      password: doc.password ?? "",
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
      subscription: doc.subscription ? {
        planId: doc.subscription.planId.toString(),
        planName: doc.subscription.planName,
        status: doc.subscription.status,
        startDate: doc.subscription.startDate,
        endDate: doc.subscription.endDate,
        stripeSessionId: doc.subscription.stripeSessionId,
      } : undefined,
      upcomingSubscription: doc.upcomingSubscription ? {
        planId: doc.upcomingSubscription.planId.toString(),
        planName: doc.upcomingSubscription.planName,
        status: doc.upcomingSubscription.status,
        startDate: doc.upcomingSubscription.startDate,
        endDate: doc.upcomingSubscription.endDate,
        stripeSessionId: doc.upcomingSubscription.stripeSessionId,
      } : undefined,
    };
  }
}

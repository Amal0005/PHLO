import { BookingEntity } from "@/domain/entities/bookingEntity";
import { BaseRepository } from "../baseRepository";
import { QueryFilter } from "mongoose";
import {
  BookingDocument,
  BookingModel,
} from "@/framework/database/model/bookingModel";
import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import { BookingStatus } from "@/utils/bookingStatus";
import { PackageModel } from "@/framework/database/model/packageModel";

export class BookingRepository
  extends BaseRepository<BookingEntity, BookingDocument>
  implements IBookingRepository {
  constructor() {
    super(BookingModel);
  }
  protected mapToEntity(doc: BookingDocument): BookingEntity {
    return BookingMapper.toEntity(doc);
  }
  async findByStripeSessionId(
    sessionId: string,
  ): Promise<BookingEntity | null> {
    const doc = await this.model
      .findOne({ stripeSessionId: sessionId })
      .populate("packageId")
      .populate("userId")
      .exec();
    return doc ? this.mapToEntity(doc) : null;
  }
  async findByUser(userId: string): Promise<BookingEntity[]> {
    const docs = await this.model
      .find({ userId })
      .populate("packageId")
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((item) => this.mapToEntity(item));
  }

  async updateStatus(
    id: string,
    status: BookingStatus,
  ): Promise<BookingEntity | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .exec();
    return updated ? this.mapToEntity(updated) : null;
  }
  async checkAvailability(packageId: string, date: Date): Promise<boolean> {
    const existing = await this.model.findOne({
      packageId,
      bookingDate: date,
      status: { $ne: BookingStatus.CANCELLED },
    });
    return !existing;
  }
  async findByCreatorId(creatorId: string): Promise<BookingEntity[]> {
    const packages = await PackageModel.find({ creatorId }).select("_id");
    const packageIds = packages.map(p => p._id.toString());
    const docs = await this.model
      .find({ packageId: { $in: packageIds } } as QueryFilter<BookingDocument>)
      .populate("packageId")
      .populate("userId")
      .sort({ bookingDate: 1 })
      .exec();
    return docs.map((item) => this.mapToEntity(item));
  }

}

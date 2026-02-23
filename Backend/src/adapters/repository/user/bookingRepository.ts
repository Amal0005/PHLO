import { BookingEntity } from "@/domain/entities/bookingEntity";
import { BaseRepository } from "../baseRepository";
import {
  BookingDocument,
  BookingModel,
} from "@/framework/database/model/bookingModel";
import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { BookingMapper } from "@/application/mapper/user/bookingMapper";
import { BookingStatus } from "@/utils/bookingStatus";

export class BookingRepository
  extends BaseRepository<BookingEntity, BookingDocument>
  implements IBookingRepository
{
  constructor() {
    super(BookingModel);
  }
  protected mapToEntity(doc: BookingDocument): BookingEntity {
    return BookingMapper.toEntity(doc);
  }
  async findByStripeSessionId(
    sessionId: string,
  ): Promise<BookingEntity | null> {
    const doc = await this.model.findOne({ stripeSessionId: sessionId }).exec();
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
}

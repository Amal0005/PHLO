import { BookingEntity } from "@/domain/entities/bookingEntity";
import { BaseRepository } from "../baseRepository";
import { QueryFilter } from "mongoose";
import {
  BookingDocument,
  BookingModel,
} from "@/framework/database/model/bookingModel";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { User } from "@/domain/entities/userEntities";
import { PackageEntity } from "@/domain/entities/packageEntity";
import { BookingStatus } from "@/constants/bookingStatus";
import { PackageModel } from "@/framework/database/model/packageModel";

export class BookingRepository
  extends BaseRepository<BookingEntity, BookingDocument>
  implements IBookingRepository {
  constructor() {
    super(BookingModel);
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

  async findBookingsForPaymentRelease(date: Date): Promise<BookingEntity[]> {
    const docs = await this.model.find({
      bookingDate: { $lt: date },
      status: BookingStatus.COMPLETED,
      paymentStatus: "held"
    }).exec();
    return docs.map(doc => this.mapToEntity(doc));
  }

  async updatePaymentStatus(id: string, paymentStatus: "held" | "released" | "refunded" | "partially_refunded"): Promise<BookingEntity | null> {
    const updated = await this.model.findByIdAndUpdate(id, { $set: { paymentStatus } }, { new: true }).exec();
    return updated ? this.mapToEntity(updated) : null;
  }

  protected mapToEntity(doc: BookingDocument): BookingEntity {
    const isPackagePopulated = doc.packageId && typeof doc.packageId === 'object' && 'title' in doc.packageId;
    const isUserPopulated = doc.userId && typeof doc.userId === 'object' && 'name' in doc.userId;

    return {
      id: doc._id.toString(),
      userId: isUserPopulated ? (doc.userId as User) : doc.userId.toString(),
      packageId: isPackagePopulated ? (doc.packageId as PackageEntity) : doc.packageId.toString(),
      amount: doc.amount,
      currency: doc.currency as "inr",
      status: doc.status,
      stripeSessionId: doc.stripeSessionId,
      bookingDate: doc.bookingDate,
      location: doc.location,
      paymentStatus: (doc as unknown as { paymentStatus?: "held" | "released" | "refunded" | "partially_refunded" }).paymentStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

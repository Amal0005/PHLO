import type { BookingEntity } from "@/domain/entities/bookingEntity";
import { BaseRepository } from "@/adapters/repository/baseRepository";
import type { QueryFilter } from "mongoose";
import type {
  BookingDocument} from "@/framework/database/model/bookingModel";
import {
  BookingModel,
} from "@/framework/database/model/bookingModel";
import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";
import type { User } from "@/domain/entities/userEntities";
import type { PackageEntity } from "@/domain/entities/packageEntity";
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
  async findByUser(userId: string, page: number, limit: number): Promise<{ bookings: BookingEntity[], totalCount: number }> {
    const skip = (page - 1) * limit;
    const [docs, totalCount] = await Promise.all([
      this.model
        .find({ userId })
        .populate("packageId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments({ userId }).exec()
    ]);
    return {
      bookings: docs.map((item) => this.mapToEntity(item)),
      totalCount
    };
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
  async findExistingBooking(packageId: string, date: Date): Promise<BookingEntity | null> {
    const existing = await this.model.findOne({
      packageId,
      bookingDate: date,
      status: { $ne: BookingStatus.CANCELLED },
    });
    return existing ? this.mapToEntity(existing) : null;
  }
  async checkAvailability(packageId: string, date: Date): Promise<boolean> {
    const existing = await this.findExistingBooking(packageId, date);
    return !existing;
  }
  async findByCreatorId(creatorId: string, page: number, limit: number): Promise<{ bookings: BookingEntity[], totalCount: number }> {
    const packages = await PackageModel.find({ creatorId }).select("_id");
    const packageIds = packages.map(p => p._id.toString());
    const skip = (page - 1) * limit;
    const filter = { packageId: { $in: packageIds } } as QueryFilter<BookingDocument>;

    const [docs, totalCount] = await Promise.all([
      this.model
        .find(filter)
        .populate("packageId")
        .populate("userId")
        .sort({ bookingDate: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter).exec()
    ]);

    return {
      bookings: docs.map((item) => this.mapToEntity(item)),
      totalCount
    };
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

    let packageData = doc.packageId as unknown;
    if (isPackagePopulated) {
      const pkg = doc.packageId as unknown as { toObject: () => Record<string, unknown>, category: { name: string } | string };
      if (pkg.category && typeof pkg.category === 'object' && 'name' in pkg.category) {
        packageData = { ...pkg.toObject(), category: String(pkg.category.name) };
      } else if (typeof (pkg as { toObject?: () => void }).toObject === 'function') {
        packageData = pkg.toObject();
      }
    }

    return {
      id: doc._id.toString(),
      userId: isUserPopulated ? (doc.userId as User) : (doc.userId?.toString() || ""),
      packageId: isPackagePopulated ? (packageData as PackageEntity) : (doc.packageId?.toString() || ""),
      amount: doc.amount,
      currency: doc.currency as "inr",
      status: doc.status,
      stripeSessionId: doc.stripeSessionId,
      bookingDate: doc.bookingDate,
      location: doc.location,
      paymentStatus: doc.paymentStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAllPopulated(filter: Record<string, unknown> = {}): Promise<BookingEntity[]> {
    const docs = await this.model
      .find(filter as QueryFilter<BookingDocument>)
      .populate({
        path: "packageId",
        populate: { path: "category", model: "Category" }
      })
      .populate("userId")
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((item) => this.mapToEntity(item));
  }
}

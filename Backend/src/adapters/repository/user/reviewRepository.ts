import { ReviewEntity } from "@/domain/entities/reviewEntity";
import { BaseRepository } from "../baseRepository";
import { IReviewModel, ReviewModel } from "@/framework/database/model/reviewModel";
import { IReviewRepository } from "@/domain/interface/repositories/IReviewRepository";

export class ReviewRepository extends BaseRepository<ReviewEntity, IReviewModel> implements IReviewRepository {
    constructor() {
        super(ReviewModel)
    }
    async findByPackageId(packageId: string): Promise<ReviewEntity[]> {
        const docs = await this.model.find({ packageId }).populate("userId", "name image").exec()
        return docs.map((item) => this.mapToEntity(item))
    }
    async findByBookingId(bookingId: string): Promise<ReviewEntity | null> {
        const doc = await this.model.findOne({ bookingId }).populate("userId", "name image").exec()
        return doc ? this.mapToEntity(doc) : null
    }
    async isExists(bookingId: string): Promise<boolean> {
        const count = await this.model.countDocuments({ bookingId })
        return count > 0
    }

    protected mapToEntity(doc: IReviewModel): ReviewEntity {
        return {
            id: doc._id.toString(),
            userId: doc.userId,
            packageId: doc.packageId,
            bookingId: doc.bookingId,
            rating: doc.rating,
            comment: doc.comment,
            createdAt: doc.createdAt,
        };
    }
}
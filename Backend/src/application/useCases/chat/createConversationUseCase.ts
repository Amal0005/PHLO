import { ConversationEntity } from "@/domain/entities/conversationEntity";
import { IChatRepository } from "@/domain/interface/repository/IChatRepository ";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";
import { AppError } from "@/domain/errors/appError";
import { StatusCode } from "@/constants/statusCodes";

export class CreateConversationUseCase {
    constructor(
        private _chatRepo: IChatRepository,
        private _bookingRepo: IBookingRepository,
        private _packageRepo: IPackageRepository
    ) { }

    async execute(bookingId: string): Promise<ConversationEntity> {
        // 1. Check if conversation already exists
        const existing = await this._chatRepo.getConversationByBooking(bookingId);
        if (existing) return existing;

        // 2. Load the booking to get userId and packageId (and from that, creatorId)
        const booking = await this._bookingRepo.findById(bookingId);
        if (!booking) throw new AppError("Booking not found", StatusCode.NOT_FOUND);

        const packageId = typeof booking.packageId === "string"
            ? booking.packageId
            : (booking.packageId as any)._id?.toString() || booking.packageId?.toString();

        const pkg = await this._packageRepo.findById(packageId);
        if (!pkg) throw new AppError("Package not found", StatusCode.NOT_FOUND);

        const creatorId = typeof pkg.creatorId === "string"
            ? pkg.creatorId
            : (pkg.creatorId as any)._id?.toString() || pkg.creatorId?.toString();

        const userId = typeof booking.userId === "string"
            ? booking.userId
            : (booking.userId as any)._id?.toString() || booking.userId?.toString();

        // 3. Create the conversation
        await this._chatRepo.createConversation({
            bookingId: bookingId as any,
            participants: [userId as any, creatorId as any],
            lastMessage: "Booking confirmed! You can now start chatting.",
            lastMessageAt: new Date(),
        });

        // 4. Return the populated version
        const newConversation = await this._chatRepo.getConversationByBooking(bookingId);
        if (!newConversation) throw new AppError("Failed to create conversation", StatusCode.INTERNAL_SERVER_ERROR);

        return newConversation;
    }
}

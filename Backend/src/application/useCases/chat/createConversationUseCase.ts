import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";
import type { IPackageRepository } from "@/domain/interfaces/repository/IPackageRepository";
import { AppError } from "@/domain/errors/appError";
import { StatusCode } from "@/constants/statusCodes";
import type { IChatRepository } from "@/domain/interfaces/repository/IChatRepository";
import type { ConversationResponseDTO } from "@/domain/dto/chat/conversationResponseDto";
import { ChatMapper } from "@/application/mapper/chatMapper";
import type { ICreateConversationUseCase } from "@/domain/interfaces/chat/ICreateConversationUseCase";

export class CreateConversationUseCase implements ICreateConversationUseCase {
    constructor(
        private _chatRepo: IChatRepository,
        private _bookingRepo: IBookingRepository,
        private _packageRepo: IPackageRepository
    ) {}

    async createConversation(bookingId: string): Promise<ConversationResponseDTO> {
        const existing = await this._chatRepo.getConversationByBooking(bookingId);
        if (existing) return ChatMapper.toConversationDTO(existing);

        const booking = await this._bookingRepo.findById(bookingId);
        if (!booking) throw new AppError("Booking not found", StatusCode.NOT_FOUND);

        const packageId = typeof booking.packageId === "string"
            ? booking.packageId
            : (booking.packageId as unknown as { _id?: { toString(): string } })._id?.toString() || booking.packageId?.toString();

        const pkg = await this._packageRepo.findById(packageId!);
        if (!pkg) throw new AppError("Package not found", StatusCode.NOT_FOUND);

        const creatorId = typeof pkg.creatorId === "string"
            ? pkg.creatorId
            : (pkg.creatorId as unknown as { _id?: { toString(): string } })._id?.toString() || pkg.creatorId?.toString();

        const userId = typeof booking.userId === "string"
            ? booking.userId
            : (booking.userId as unknown as { _id?: { toString(): string } })._id?.toString() || booking.userId?.toString();

        await this._chatRepo.createConversation({
            bookingId: bookingId as string,
            participants: [userId as string, creatorId as string],
            lastMessage: "Booking confirmed! You can now start chatting.",
            lastMessageAt: new Date(),
        });

        const newConversation = await this._chatRepo.getConversationByBooking(bookingId);
        if (!newConversation) throw new AppError("Failed to create conversation", StatusCode.INTERNAL_SERVER_ERROR);

        return ChatMapper.toConversationDTO(newConversation);
    }
}

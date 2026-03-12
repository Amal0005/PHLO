import { ChatController } from "@/adapters/controllers/chatController";
import { ChatRepository } from "@/adapters/repository/chatRepository";
import { BookingRepository } from "@/adapters/repository/user/bookingRepository";
import { PackageRepository } from "@/adapters/repository/creator/packageRepository";
import { GetConversationUseCase } from "@/application/useCases/chat/getConversationUseCase";
import { GetMessageUseCase } from "@/application/useCases/chat/getMessageUseCase";
import { SendMessageUseCase } from "@/application/useCases/chat/sendMessageUseCase";
import { CreateConversationUseCase } from "@/application/useCases/chat/createConversationUseCase";
import { sendNotificationUseCase } from "./notificationInjections";
import { UserRepository } from "@/adapters/repository/user/userRepository";
import { CreatorRepository } from "@/adapters/repository/creator/creatorRepository";

const chatRepo = new ChatRepository();
const bookingRepo = new BookingRepository();
const packageRepo = new PackageRepository();
const userRepo = new UserRepository();
const creatorRepo = new CreatorRepository();

const getConversationUseCase = new GetConversationUseCase(chatRepo);
const getMessagesUseCase = new GetMessageUseCase(chatRepo);
const sendMessageUseCase = new SendMessageUseCase(chatRepo, sendNotificationUseCase, userRepo, creatorRepo);
const getOrCreateConversationUseCase = new CreateConversationUseCase(chatRepo, bookingRepo, packageRepo);

export const chatController = new ChatController(
    getConversationUseCase,
    getMessagesUseCase,
    sendMessageUseCase,
    getOrCreateConversationUseCase
);
import { NotificationRepository } from "../../adapters/repository/notificationRepository";
import { NotificationController } from "../../adapters/controllers/notificationController";
import { SendNotificationUseCase } from "@/application/useCases/notification/sendNotificationUseCase";
import { GetNotificationsUseCase } from "@/application/useCases/notification/getNotificationsUseCase";
import { MarkNotificationReadUseCase } from "@/application/useCases/notification/markNotificationReadUseCase";
import { MarkAllNotificationReadUseCase } from "@/application/useCases/notification/markAllNotificationReadUseCase";
import { CountUnreadUseCase } from "@/application/useCases/notification/countUnreadUseCase";
import { GetNotificationByIdUseCase } from "@/application/useCases/notification/getNotificationDetailsUseCse";

const notificationRepo = new NotificationRepository();

const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepo);
const getByIdUseCase = new GetNotificationByIdUseCase(notificationRepo);
const countUnreadUseCase = new CountUnreadUseCase(notificationRepo);
const markReadUseCase = new MarkNotificationReadUseCase(notificationRepo);
const markAllReadUseCase = new MarkAllNotificationReadUseCase(notificationRepo);

export const sendNotificationUseCase = new SendNotificationUseCase(notificationRepo);
export const notificationController = new NotificationController(getNotificationsUseCase, getByIdUseCase, countUnreadUseCase, markReadUseCase, markAllReadUseCase);

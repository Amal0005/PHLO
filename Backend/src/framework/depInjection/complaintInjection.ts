import { ComplaintController } from "@/adapters/controllers/complaintController";
import { ComplaintRepository } from "@/adapters/repository/complaintRepository";
import { BookingRepository } from "@/adapters/repository/user/bookingRepository";
import { WalletRepository } from "@/adapters/repository/walletRepository";
import { GetAllComplaintsUseCase } from "@/application/useCases/admin/complaint/getAllComplaintsUseCase";
import { RejectComplaintUseCase } from "@/application/useCases/admin/complaint/rejectComplaintUseCase";
import { ResolveComplaintUseCase } from "@/application/useCases/admin/complaint/resolveComplaintUseCase";
import { RegisterComplaintUseCase } from "@/application/useCases/user/complaint/registerComplaintUseCase";
import { GetComplaintByBookingUseCase } from "@/application/useCases/user/complaint/getComplaintByBookingUseCase";
import { UserRepository } from "@/adapters/repository/user/userRepository";
import { sendNotificationUseCase } from "@/framework/depInjection/notificationInjections";


const complaintRepo = new ComplaintRepository();
const bookingRepo = new BookingRepository();
const walletRepo = new WalletRepository();
const userRepo = new UserRepository();

const registerUseCase = new RegisterComplaintUseCase(complaintRepo, bookingRepo, userRepo, sendNotificationUseCase)
const getAllUseCase = new GetAllComplaintsUseCase(complaintRepo);
const resolveUseCase = new ResolveComplaintUseCase(complaintRepo, bookingRepo, walletRepo, sendNotificationUseCase);
const rejectUseCase = new RejectComplaintUseCase(complaintRepo, bookingRepo, walletRepo, sendNotificationUseCase);
const getByBookingUseCase = new GetComplaintByBookingUseCase(complaintRepo);

export const complaintController = new ComplaintController(registerUseCase, getAllUseCase, resolveUseCase, rejectUseCase, getByBookingUseCase);

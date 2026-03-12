import { ComplaintController } from "@/adapters/controllers/complaintController";
import { ComplaintRepository } from "@/adapters/repository/complaintRepository";
import { BookingRepository } from "@/adapters/repository/user/bookingRepository";
import { WalletRepository } from "@/adapters/repository/walletRepository";
import { GetAllComplaintsUseCase } from "@/application/useCases/admin/complaint/getAllComplaintsUseCase";
import { ResolveComplaintUseCase } from "@/application/useCases/admin/complaint/resolveComplaintUseCase";
import { RegisterComplaintUseCase } from "@/application/useCases/user/complaint/registerComplaintUseCase";


const complaintRepo = new ComplaintRepository();
const bookingRepo = new BookingRepository();
const walletRepo = new WalletRepository();

const registerUseCase = new RegisterComplaintUseCase(complaintRepo)
const getAllUseCase = new GetAllComplaintsUseCase(complaintRepo);
const resolveUseCase = new ResolveComplaintUseCase(complaintRepo, bookingRepo, walletRepo);

export const complaintController = new ComplaintController(registerUseCase, getAllUseCase, resolveUseCase);

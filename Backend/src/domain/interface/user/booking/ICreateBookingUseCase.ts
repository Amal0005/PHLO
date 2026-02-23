import { CreateBookingRequestDTO } from "@/domain/dto/booking/createBookingRequestDto";
import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";

export interface ICreateBookingUseCase{
    createBooking(userId: string, data: CreateBookingRequestDTO):Promise<CheckoutSessionResponseDTO>
}
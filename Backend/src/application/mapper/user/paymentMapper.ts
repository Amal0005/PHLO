import { CreateCheckoutSessionDTO } from "@/domain/dto/payment/createCheckoutSessionDto";
import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { User } from "@/domain/entities/userEntities";
import { CreatorEntity } from "@/domain/entities/creatorEntities";
import Stripe from "stripe";

export class PaymentMapper {
    static toCreateSessionDto(
        booking: { id?: string; userId: string | User },
        pkg: { title: string; price: number },
        creatorId: string,
        baseUrl: string
    ): CreateCheckoutSessionDTO {
        const userId = typeof booking.userId === 'string' 
            ? booking.userId 
            : (booking.userId as User)._id?.toString() || "";

        return {
            bookingId: booking.id!,
            creatorId: creatorId,
            packageName: pkg.title,
            amount: pkg.price,
            successUrl: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${baseUrl}/payment-cancel?booking_id=${booking.id}`,
            type: "booking",
            userId: userId
        };
    }

    static toWallpaperCreateSessionDto(
        wallpaper: { _id?: string; title: string; price: number; creatorId: string | CreatorEntity },
        userId: string,
        successUrl: string,
        cancelUrl: string
    ): CreateCheckoutSessionDTO {
        return {
            wallpaperId: wallpaper._id,
            userId: userId,
            creatorId: wallpaper.creatorId.toString(),
            packageName: `Wallpaper: ${wallpaper.title}`,
            amount: wallpaper.price,
            successUrl,
            cancelUrl,
            type: "wallpaper"
        };
    }

    static toCheckoutSessionResponseDto(session: Stripe.Checkout.Session): CheckoutSessionResponseDTO {
        return {
            id: session.id,
            url: session.url
        };
    }
}

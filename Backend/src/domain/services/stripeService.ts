import Stripe from "stripe";
import type { IStripeService } from "@/domain/interfaces/service/IStripeService";
import type { CreateCheckoutSessionDTO } from "@/domain/dto/payment/createCheckoutSessionDto";
import type { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";

export class StripeService implements IStripeService {
  private stripe: Stripe;
  private webhookSecret: string;
  private currency: string;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not defined in environment variables",
      );
    }

    if (!webhookSecret) {
      throw new Error(
        "STRIPE_WEBHOOK_SECRET is not defined in environment variables",
      );
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: "2026-01-28.clover",
    });

    this.webhookSecret = webhookSecret;
    this.currency = process.env.STRIPE_CURRENCY || "inr";
  }

  async createCheckoutSession(
    data: CreateCheckoutSessionDTO,
  ): Promise<CheckoutSessionResponseDTO> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: this.currency,
              product_data: { name: data.packageName },
              unit_amount: Math.round(data.amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        client_reference_id: data.userId,
        metadata: {
          type: data.type,
          bookingId: data.bookingId || "",
          subscriptionId: data.subscriptionId || "",
          wallpaperId: data.wallpaperId || "",
          userId: data.userId || "",
          creatorId: data.creatorId,
        },
      });
      return { id: session.id, url: session.url };
    } catch (error) {
      throw error;
    }
  }

  async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.error("StripeService: Error retrieving session:", error);
      return null;
    }
  }

  constructEvent(payload: string | Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
    );
  }
}

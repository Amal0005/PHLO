import Stripe from "stripe";
import {IStripeService} from "../interface/service/IStripeService";
import { CreateCheckoutSessionDTO } from "../dto/payment/createCheckoutSessionDTO";
import { CheckoutSessionResponseDTO } from "../dto/payment/checkoutSessionResponseDto";

export class StripeService implements IStripeService {
  private stripe: Stripe;
  private webhookSecret: string;
  private currency: string;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
    }

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not defined in environment variables");
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: "2026-01-28.clover",

    });

    this.webhookSecret = webhookSecret;
    this.currency = process.env.STRIPE_CURRENCY || "inr";
  }

  async createCheckoutSession(
    data: CreateCheckoutSessionDTO
  ): Promise<CheckoutSessionResponseDTO> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: this.currency,
            product_data: {
              name: data.packageName,
            },
            unit_amount: data.amount * 100, // convert to paise
          },
          quantity: 1,
        },
      ],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        bookingId: data.bookingId,
      },
    });

    return {
      id: session.id,
      url: session.url,
    };
  }

  constructEvent(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret
    );
  }
}

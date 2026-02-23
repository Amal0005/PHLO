import api from "@/axios/axiosConfig";

export const CreatorSubscriptionService = {
  async getSubscriptions() {
    const res = await api.get("/creator/subscription");
    return res.data;
  },
  async buySubscription(subscriptionId: string) {
    const successUrl = `${window.location.origin}/creator/subscription-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${window.location.origin}/creator/subscription-cancel`;
    const res = await api.post("/creator/subscription/buy", {
      subscriptionId,
      successUrl,
      cancelUrl,
    });
    return res.data;
  },
  async confirmSubscription(sessionId: string) {
    const res = await api.post("/creator/subscription/confirm", { sessionId });
    return res.data;
  },
};

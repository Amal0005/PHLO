import api from "@/axios/axiosConfig";

export const CreatorSubscriptionService = {
  async getSubscriptions() {
    const res = await api.get("/creator/subscription");
    return res.data;
  },
  async buySubscription(subscriptionId: string) {
    const res = await api.post("/creator/subscription/buy", {
      subscriptionId,
    });
    return res.data;
  },
};

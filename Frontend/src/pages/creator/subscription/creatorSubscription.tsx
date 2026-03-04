import { useEffect, useState } from "react";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { toast } from "react-toastify";
import { CreatorSubscriptionService } from "@/services/creator/creatorSubscriptionService";
import { Check, Crown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function CreatorSubscription() {
  const [plans, setPlans] = useState<{
    _id: string;
    subscriptionId?: string;
    name: string;
    price: number;
    features: string[];
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const creator = useSelector((state: RootState) => state.creator.creator);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await CreatorSubscriptionService.getSubscriptions();
      setPlans(res.data);
    } catch (error) {
      console.error("Failed to fetch plans", error);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (id: string) => {
    try {
      const res = await CreatorSubscriptionService.buySubscription(id);
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || "Purchase failed. Please try again.";
      toast.error(message);
    }
  };

  const isActivePlan = (planId: string) => {
    return creator?.subscription?.status === "active" && creator.subscription.planId === planId;
  };

  const hasAnyActivePlan = () => {
    return creator?.subscription?.status === "active";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-black mb-6">Choose Your Plan</h1>
          <p className="text-gray-400 text-xl">Unlock premium features and grow your audience</p>
          {hasAnyActivePlan() && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400">
              <Crown size={14} className="text-yellow-500" />
              You currently have an active <span className="text-white font-bold">{creator?.subscription?.planName}</span> plan
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan._id} className={`bg-zinc-900 border ${isActivePlan(plan._id) ? 'border-white' : 'border-white/10'} rounded-3xl p-8 flex flex-col hover:border-white/30 transition-all relative overflow-hidden group`}>
                {isActivePlan(plan._id) && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-white text-black text-xs font-bold rounded-bl-xl">
                    CURRENT PLAN
                  </div>
                )}
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-black">₹{plan.price}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features?.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-gray-400">
                      <Check size={18} className="text-white" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleBuy(plan.subscriptionId || plan._id)}
                  disabled={hasAnyActivePlan()}
                  className={`w-full py-4 font-bold rounded-2xl transition-all ${isActivePlan(plan._id)
                    ? "bg-zinc-800 text-gray-500 cursor-not-allowed"
                    : hasAnyActivePlan()
                      ? "bg-zinc-800 text-gray-500 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-200"
                    }`}
                >
                  {isActivePlan(plan._id) ? "Current Plan" : hasAnyActivePlan() ? "Already Subscribed" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

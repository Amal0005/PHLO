import { useEffect, useState } from "react";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { Check, Crown } from "lucide-react";
import { CreatorSubscriptionService } from "@/services/creator/creatorSubscriptionService";
import { CreatorProfileServices } from "@/services/creator/creatorProfileService";
import { toast } from "react-toastify";

export default function CreatorSubscription() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, profileRes] = await Promise.all([
        CreatorSubscriptionService.getSubscriptions(),
        CreatorProfileServices.getProfile(),
      ]);
      setPlans(plansRes.data);

      const sub = profileRes.creator?.subscription;
      if (sub?.status === "active" && new Date(sub.endDate) > new Date()) {
        setActivePlanId(sub.planId);
      }
    } catch {
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (id: string) => {
    if (buyingId) return;
    setBuyingId(id);
    try {
      const res = await CreatorSubscriptionService.buySubscription(id);
      if (res.url) {
        window.location.href = res.url;
      }
    } catch {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setBuyingId(null);
    }
  };

  const isActivePlan = (planId: string) => activePlanId === planId;

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-black mb-6">Choose Your Plan</h1>
          <p className="text-gray-400 text-xl">Unlock premium features and grow your audience</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`bg-zinc-900 border rounded-3xl p-8 flex flex-col transition-all ${isActivePlan(plan.subscriptionId)
                    ? "border-green-500/40 ring-1 ring-green-500/20"
                    : "border-white/10 hover:border-white/30"
                  }`}
              >
                {isActivePlan(plan.subscriptionId) && (
                  <div className="flex items-center gap-2 mb-4 text-green-400 text-sm font-bold">
                    <Crown size={16} />
                    Current Plan
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
                  onClick={() => handleBuy(plan.subscriptionId)}
                  disabled={isActivePlan(plan.subscriptionId) || buyingId === plan.subscriptionId}
                  className={`w-full py-4 font-bold rounded-2xl transition-colors ${isActivePlan(plan.subscriptionId)
                      ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                >
                  {isActivePlan(plan.subscriptionId)
                    ? "Active"
                    : buyingId === plan.subscriptionId
                      ? "Redirecting..."
                      : activePlanId
                        ? "Switch Plan"
                        : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

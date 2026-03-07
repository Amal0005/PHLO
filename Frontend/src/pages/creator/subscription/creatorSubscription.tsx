import { useEffect, useState } from "react";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { toast } from "react-toastify";
import { CreatorSubscriptionService } from "@/services/creator/creatorSubscriptionService";
import { CreatorProfileServices } from "@/services/creator/creatorProfileService";
import { Check, Crown, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCreator } from "@/store/slices/creator/creatorSlice";

export default function CreatorSubscription() {
  const [plans, setPlans] = useState<{
    _id: string;
    subscriptionId?: string;
    name: string;
    price: number;
    duration: number;
    features: string[];
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const creator = useSelector((state: RootState) => state.creator.creator);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPlans();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await CreatorProfileServices.getProfile();
      if (res.success) {
        dispatch(setCreator(res.creator as any));
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

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
    setBuyingId(id);
    try {
      const res = await CreatorSubscriptionService.buySubscription(id);
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || "Purchase failed. Please try again.";
      toast.error(message);
    } finally {
      setBuyingId(null);
    }
  };

  const isActivePlan = (planId: string | undefined) => {
    if (!planId || !creator?.subscription?.planId) return false;
    return creator.subscription.status === "active" && creator.subscription.planId === planId;
  };

  const hasAnyActivePlan = () => {
    return creator?.subscription?.status === "active";
  };

  const hasUpcomingSubscription = () => {
    return !!creator?.upcomingSubscription?.planId;
  };

  const isUpcomingPlan = (planId: string | undefined) => {
    if (!planId || !creator?.upcomingSubscription?.planId) return false;
    return creator.upcomingSubscription.planId === planId;
  };

  const getDurationLabel = (months: number) => {
    if (months === 1) return "/month";
    if (months === 12) return "/year";
    return `/${months} months`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-black mb-6">Choose Your Plan</h1>
          <p className="text-gray-400 text-xl">Unlock premium features and grow your audience</p>

          <div className="mt-8 flex flex-col items-center gap-4">
            {hasAnyActivePlan() && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400">
                <Crown size={14} className="text-yellow-500" />
                You currently have an active <span className="text-white font-bold">{creator?.subscription?.planName}</span> plan
              </div>
            )}

            {hasUpcomingSubscription() && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400">
                <Check size={14} />
                Your upgrade to <span className="text-white font-bold">{creator?.upcomingSubscription?.planName}</span> is scheduled for activation
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-500">Loading plans...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const currentPlanId = plan.subscriptionId || plan._id;
              const active = isActivePlan(currentPlanId);
              const upcoming = isUpcomingPlan(currentPlanId);
              const buyInProgress = buyingId === currentPlanId;

              return (
                <div
                  key={plan._id || plan.subscriptionId}
                  className={`bg-zinc-900 border ${active ? 'border-white' : upcoming ? 'border-blue-500/50' : 'border-white/10'} rounded-3xl p-8 flex flex-col hover:border-white/30 transition-all relative overflow-hidden group`}
                >
                  {active && (
                    <div className="absolute top-0 right-0 px-4 py-1 bg-white text-black text-xs font-bold rounded-bl-xl">
                      CURRENT PLAN
                    </div>
                  )}
                  {upcoming && (
                    <div className="absolute top-0 right-0 px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-bl-xl">
                      UPCOMING PLAN
                    </div>
                  )}

                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black">₹{plan.price}</span>
                    <span className="text-gray-500 ml-2">{getDurationLabel(plan.duration)}</span>
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
                    onClick={() => handleBuy(currentPlanId)}
                    disabled={active || upcoming || hasUpcomingSubscription() || buyingId !== null}
                    className={`w-full py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${active || upcoming || (hasUpcomingSubscription() && !upcoming)
                        ? "bg-zinc-800 text-gray-500 cursor-not-allowed"
                        : "bg-white text-black hover:bg-gray-200"
                      }`}
                  >
                    {buyInProgress ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : active ? (
                      "Current Plan"
                    ) : upcoming ? (
                      "Upgrade Queued"
                    ) : (hasUpcomingSubscription() && !upcoming) ? (
                      "Limited to 1 Queue"
                    ) : hasAnyActivePlan() ? (
                      "Upgrade Plan"
                    ) : (
                      "Get Started"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

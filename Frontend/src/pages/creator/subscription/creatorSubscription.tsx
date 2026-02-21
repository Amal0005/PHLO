import { useEffect, useState } from "react";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { Check } from "lucide-react";
import { CreatorSubscriptionService } from "@/services/creator/creatorSubscriptionService";

export default function CreatorSubscription() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await CreatorSubscriptionService.getSubscriptions();
      setPlans(res.data);
    } catch (error) {
      console.error("Failed to fetch plans", error);
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
    } catch (error) {
      console.error("Purchase failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-black mb-6">Choose Your Plan</h1>
          <p className="text-gray-400 text-xl">Unlock premium features and grow your audience</p>
        </div>

        {loading ? (
          <div className="flex justify-center">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan._id} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/30 transition-all">
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
                  onClick={() => handleBuy(plan._id)}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

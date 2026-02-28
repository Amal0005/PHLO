import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { CreatorProfileServices } from "@/services/creator/creatorProfileService";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "processing" | "error">("verifying");

  useEffect(() => {
    verifySubscription();
  }, []);

  const verifySubscription = async () => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    try {
      // Verify by checking if the creator's subscription is now active
      const res = await CreatorProfileServices.getProfile();
      const sub = res.creator?.subscription;

      if (sub?.status === "active" && sub?.stripeSessionId === sessionId) {
        setStatus("success");
      } else {
        // Webhook may not have fired yet — wait and retry
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const retryRes = await CreatorProfileServices.getProfile();
        const retrySub = retryRes.creator?.subscription;

        if (retrySub?.status === "active" && retrySub?.stripeSessionId === sessionId) {
          setStatus("success");
        } else {
          setStatus("processing");
        }
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 text-center">
      <div className="max-w-md">
        {status === "verifying" ? (
          <>
            <Loader2 size={80} className="mx-auto text-white mb-8 animate-spin" />
            <h1 className="text-4xl font-black mb-4">Verifying Payment...</h1>
            <p className="text-gray-400 mb-8 text-lg">Please wait while we confirm your subscription.</p>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 size={80} className="mx-auto text-green-500 mb-8" />
            <h1 className="text-4xl font-black mb-4">Payment Successful!</h1>
            <p className="text-gray-400 mb-8 text-lg">Your subscription is now active. You can start using premium features right away.</p>
            <button
              onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        ) : status === "processing" ? (
          <>
            <Loader2 size={80} className="mx-auto text-yellow-500 mb-8 animate-spin" />
            <h1 className="text-4xl font-black mb-4">Payment Processing</h1>
            <p className="text-gray-400 mb-8 text-lg">Your payment was initiated successfully. We are waiting for final confirmation from the provider. This usually takes a few seconds.</p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setStatus("verifying");
                  verifySubscription();
                }}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Refresh Status
              </button>
              <button
                onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
                className="w-full py-4 text-white/60 hover:text-white font-medium underline underline-offset-4 decoration-white/20"
              >
                Continue to Dashboard anyway
              </button>
            </div>
          </>
        ) : (
          <>
            <AlertCircle size={80} className="mx-auto text-red-500 mb-8" />
            <h1 className="text-4xl font-black mb-4">Verification Failed</h1>
            <p className="text-gray-400 mb-8 text-lg">We couldn't verify your payment yet. Don't worry, your subscription will be activated automatically once the bank approves the transaction.</p>
            <div className="space-y-4">
              <button
                onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate(ROUTES.CREATOR.SUBSCRIPTIONS)}
                className="w-full py-4 text-gray-400 font-medium"
              >
                View Plans
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

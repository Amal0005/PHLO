import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CheckCircle2 } from "lucide-react";
import { CreatorSubscriptionService } from "@/services/creator/creatorSubscriptionService";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      setErrorMsg("Invalid payment session. Please try again.");
      return;
    }

    const confirm = async () => {
      try {
        const res = await CreatorSubscriptionService.confirmSubscription(sessionId);
        if (res.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg(res.message || "Failed to activate subscription");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.response?.data?.message || "Failed to confirm subscription. Please contact support.");
      }
    };

    confirm();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-8" />
          <h1 className="text-2xl font-bold mb-4">Activating your subscription...</h1>
          <p className="text-gray-400">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Subscription Activation Failed</h1>
          <p className="text-gray-400 mb-8">{errorMsg}</p>
          <button
            onClick={() => navigate(ROUTES.CREATOR.SUBSCRIPTIONS)}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl"
          >
            Back to Subscriptions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <CheckCircle2 size={80} className="mx-auto text-green-500 mb-8" />
        <h1 className="text-4xl font-black mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-8 text-lg">Your subscription is now active. You can start using premium features right away.</p>
        <button
          onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

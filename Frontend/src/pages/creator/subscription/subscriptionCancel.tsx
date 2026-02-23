import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { XCircle } from "lucide-react";

export default function SubscriptionCancel() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <XCircle size={80} className="mx-auto text-red-500 mb-8" />
        <h1 className="text-4xl font-black mb-4">Payment Cancelled</h1>
        <p className="text-gray-400 mb-8 text-lg">Your payment was not completed. If this was a mistake, you can try again.</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate(ROUTES.CREATOR.SUBSCRIPTIONS)}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
            className="w-full py-4 text-gray-400 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

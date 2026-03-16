import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CreatorProfileServices } from "@/services/creator/creatorProfileService";
import { setCreator, Creator } from "@/store/slices/creator/creatorSlice";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshProfile = async () => {
      try {
        const res = await CreatorProfileServices.getProfile();
        if (res.success) {
          dispatch(setCreator(res.creator as unknown as Creator));
        }
      } catch (error) {
        console.error("Failed to refresh profile after success", error);
      }
    };
    refreshProfile();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <CheckCircle2 size={80} className="mx-auto text-green-500 mb-8" />
        <h1 className="text-4xl font-black mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-8 text-lg">Your subscription is now active or queued. You can check your status in the dashboard.</p>
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

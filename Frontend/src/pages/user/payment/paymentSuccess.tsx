import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { BookingService } from "@/services/user/bookingService";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"verifying" | "completed" | "cancelled" | "failed">("verifying");
  const timerRef = useRef<any>(null);
  const pollRef = useRef<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await BookingService.getBookingDetail(sessionId);
        if (response.success && response.data.status === "completed") {
          setStatus("completed");
          if (pollRef.current) clearInterval(pollRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };

    // Check status immediately
    checkStatus();

    // Start polling every 2 seconds to see if webhook finished
    pollRef.current = setInterval(checkStatus, 2000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionId]);


  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-12 rounded-[2rem] text-center space-y-8">
        <div className="flex justify-center">
          {status === "verifying" && (
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          )}
          {status === "completed" && (
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          )}
          {status === "cancelled" && (
            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
            </div>
          )}
          {(status === "failed") && (
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          )}
        </div>

        <div>
          {status === "verifying" && (
            <>
              <h1 className="text-3xl font-bold text-white mb-3">Verifying Payment...</h1>
              <p className="text-gray-400">Please wait while we confirm your payment with Stripe.</p>
              <p className="text-zinc-600 text-sm mt-4 italic">This usually takes just a few seconds.</p>
            </>
          )}
          {status === "completed" && (
            <>
              <h1 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h1>
              <p className="text-gray-400">Thank you for your investment. Your package has been successfully booked.</p>
            </>
          )}
          {status === "cancelled" && (
            <>
              <h1 className="text-3xl font-bold text-white mb-3">Payment Timed Out</h1>
              <p className="text-gray-400">We couldn't verify your payment in time. The booking has been cancelled.</p>
            </>
          )}
          {status === "failed" && (
            <>
              <h1 className="text-3xl font-bold text-white mb-3">Verification Failed</h1>
              <p className="text-gray-400">Something went wrong while verifying your payment. Please contact support if you were charged.</p>
            </>
          )}
        </div>

        <button
          onClick={() => navigate(ROUTES.USER.HOME)}
          className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          {status === "verifying" ? "Return to Home" : "Return Home"}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

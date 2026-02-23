import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-12 rounded-[2rem] text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">Payment Cancelled</h1>
          <p className="text-gray-400">The booking process was cancelled. No charges were made.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;

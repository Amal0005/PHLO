import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-12 rounded-[2rem] text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h1>
          <p className="text-gray-400">Thank you for your investment. Your package has been successfully booked.</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.USER.HOME)}
          className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

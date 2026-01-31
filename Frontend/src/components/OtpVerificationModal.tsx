import { useState, useEffect } from "react";
import { X, Shield } from "lucide-react";
import { toast } from "react-toastify";

interface OtpVerificationModalProps {
    email: string;
    isOpen: boolean;
    onClose: () => void;
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
    title?: string;
    description?: string;
}

export default function OtpVerificationModal({
    email,
    isOpen,
    onClose,
    onVerify,
    onResend,
    title = "Verify Your Email",
    description = "Enter the 6-digit code sent to",
}: OtpVerificationModalProps) {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (isOpen && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setCanResend(true);
        }
    }, [timer, isOpen]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 6) return;

        try {
            setIsVerifying(true);
            await onVerify(otpValue);
        } catch (error: any) {
            console.error("Verification error:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Invalid OTP. Try again.";
            toast.error(errorMessage);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        try {
            await onResend();
            toast.info("OTP resent successfully!");
            setTimer(60);
            setCanResend(false);
            setOtp(["", "", "", "", "", ""]);
        } catch (error: any) {
            console.error("Resend error:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to resend OTP. Try again.";
            toast.error(errorMessage);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/10 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-400">{description}</p>
                    <p className="text-sm text-white font-medium mt-1">{email}</p>
                </div>

                <div className="flex gap-2 justify-center mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-lg bg-zinc-800/50 border border-zinc-700 text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={isVerifying || otp.join("").length !== 6}
                    className="w-full bg-white hover:bg-gray-200 text-black py-3.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isVerifying ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Verifying...
                        </span>
                    ) : (
                        "Verify Code"
                    )}
                </button>

                <p className="text-center text-gray-400 text-xs sm:text-sm mt-4">
                    Didn't receive the code?{" "}
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-white hover:underline font-medium"
                        >
                            Resend
                        </button>
                    ) : (
                        <span>
                            Resend in <span className="text-white font-mono">{timer}s</span>
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}

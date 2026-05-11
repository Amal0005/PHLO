import { useState, useEffect } from "react";
import { X, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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
    const [isResending, setIsResending] = useState(false);
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

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pastedData) return;

        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
            newOtp[i] = pastedData[i] || "";
        }
        setOtp(newOtp);

        const focusIndex = Math.min(pastedData.length, 5);
        document.getElementById(`otp-input-${focusIndex}`)?.focus();
    };

    const handleVerify = async () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 6) return;

        try {
            setIsVerifying(true);
            await onVerify(otpValue);
        } catch (error: unknown) {
            console.error("Verification error:", error);
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                (error as Error).message ||
                "Invalid OTP. Try again.";
            toast.error(errorMessage);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!canResend || isResending) return;

        try {
            setIsResending(true);
            await onResend();
            toast.info("OTP resent successfully!");
            setTimer(60);
            setCanResend(false);
            setOtp(["", "", "", "", "", ""]);
        } catch (error: unknown) {
            console.error("Resend error:", error);
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                "Failed to resend OTP. Try again.";
            toast.error(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-zinc-950/90 backdrop-blur-2xl rounded-3xl shadow-[0_32px_120px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-8 border border-white/10 w-full max-w-md relative overflow-hidden"
                    >
                        {/* Subtle inner glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors relative z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6 relative z-10">
                            <motion.div 
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-4"
                            >
                                <Shield className="w-8 h-8 text-white" />
                            </motion.div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                                {title}
                            </h3>
                            <p className="text-sm text-zinc-400 font-light">{description}</p>
                            <p className="text-sm text-white font-medium mt-1">{email}</p>
                        </div>

                        <div className="flex gap-2 justify-center mb-6 relative z-10">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleVerify}
                            disabled={isVerifying || otp.join("").length !== 6}
                            className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base relative z-10 shadow-xl"
                        >
                            {isVerifying ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Verifying...
                                </span>
                            ) : (
                                "Verify Code"
                            )}
                        </motion.button>

                        <p className="text-center text-zinc-500 text-xs sm:text-sm mt-6 relative z-10">
                            Didn't receive the code?{" "}
                            {canResend ? (
                                <button
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-white hover:underline font-bold disabled:opacity-50 disabled:no-underline transition-all"
                                >
                                    {isResending ? "Resending..." : "Resend"}
                                </button>
                            ) : (
                                <span className="font-medium text-zinc-400">
                                    Resend in <span className="text-white font-mono">{timer}s</span>
                                </span>
                            )}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

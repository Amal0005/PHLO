import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar,
    Clock,
    MapPin,
    Package as PackageIcon,
    ChevronLeft,
    AlertCircle,
    CreditCard,
    CheckCircle2,
    XCircle,
    Download,
    MessageSquare
} from "lucide-react";
import { BookingService } from "@/services/user/bookingService";
import { UserBooking } from "@/interface/user/userBookingInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import UserNavbar from "@/compoents/reusable/userNavbar";
import { toast } from "react-toastify";
import ConfirmModal from "@/compoents/reusable/ConfirmModal";
import { ROUTES } from "@/constants/routes";
import AddReviewForm from "./components/AddReviewForm";

const BookingDetailPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [booking, setBooking] = useState<UserBooking | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [processingCancel, setProcessingCancel] = useState(false);
    const [retryingPayment, setRetryingPayment] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingDetail = async () => {
            if (!sessionId) return;
            try {
                setLoading(true);
                const response = await BookingService.getBookingDetail(sessionId);
                if (response.success) {
                    setBooking(response.data);
                } else {
                    toast.error("Booking not found");
                    navigate(ROUTES.USER.BOOKINGS);
                }
            } catch (error) {
                console.error("Failed to fetch booking detail:", error);
                toast.error("An error occurred while fetching booking details");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetail();
    }, [sessionId, navigate]);

    const handleConfirmCancel = async () => {
        if (!sessionId) return;

        try {
            setProcessingCancel(true);
            const response = await BookingService.cancelBooking(sessionId);
            if (response.success) {
                toast.success("Booking cancelled successfully");
                // Refresh data
                const updated = await BookingService.getBookingDetail(sessionId);
                if (updated.success) setBooking(updated.data);
            } else {
                toast.error(response.message || "Failed to cancel booking");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "error occurred during cancellation");
        } finally {
            setProcessingCancel(false);
            setIsCancelModalOpen(false);
        }
    };

    const handleRetryPayment = async () => {
        if (!sessionId) return;
        try {
            setRetryingPayment(true);
            const response = await BookingService.retryPayment(sessionId, window.location.origin);
            if (response.success && response.data.url) {
                window.location.href = response.data.url;
            } else {
                toast.error("Failed to generate payment link");
            }
        } catch (error) {
            console.error("Retry payment error:", error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setRetryingPayment(false);
        }
    };

    const getStatusConfig = (status: UserBooking['status']) => {
        switch (status) {
            case 'completed':
                return {
                    label: "Confirmed",
                    icon: <CheckCircle2 className="w-4 h-4" />,
                    style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    bgGlow: "bg-emerald-500/5"
                };
            case 'pending':
                return {
                    label: "Pending",
                    icon: <AlertCircle className="w-4 h-4" />,
                    style: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                    bgGlow: "bg-amber-500/5"
                };
            case 'cancelled':
                return {
                    label: "Cancelled",
                    icon: <XCircle className="w-4 h-4" />,
                    style: "bg-rose-500/10 text-rose-500 border-rose-500/20",
                    bgGlow: "bg-rose-500/5"
                };
            default:
                return {
                    label: status,
                    icon: <AlertCircle className="w-4 h-4" />,
                    style: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
                    bgGlow: "bg-zinc-500/5"
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Experience</p>
                </div>
            </div>
        );
    }

    if (!booking) return null;

    const statusConfig = getStatusConfig(booking.status);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            <UserNavbar />

            <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
                {/* Back Button */}
                <button
                    onClick={() => navigate(ROUTES.USER.BOOKINGS)}
                    className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12"
                >
                    <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-zinc-600 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Bookings</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Image & Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Header Section */}
                        <div className="space-y-6">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-700 ${statusConfig.style}`}>
                                {statusConfig.icon}
                                <span className="text-[10px] font-black uppercase tracking-widest">{statusConfig.label}</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase break-words">
                                {booking.packageDetails?.title || "Booking Adventure"}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-zinc-600" />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        {new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-zinc-600" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{booking.location || "Location TBD"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-zinc-600" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Full Session Access</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Asset */}
                        <div className="group relative aspect-[16/10] rounded-[3rem] overflow-hidden bg-zinc-900 border border-zinc-800/50">
                            {booking.packageDetails?.images?.[0] ? (
                                <S3Media
                                    s3Key={booking.packageDetails.images[0]}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <PackageIcon className="w-16 h-16 text-zinc-800" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600">Experience Overview</h2>
                            <p className="text-xl text-zinc-400 leading-relaxed font-light break-all whitespace-pre-wrap">
                                {booking.packageDetails?.description || "Get ready for a professional photography session tailored to your unique style. We'll capture every detail with artistic precision and cinematic flair."}
                            </p>
                        </div>

                        {/* Review Section */}
                        {booking.status === 'completed' && new Date(booking.bookingDate) <= new Date() && (
                            <div className="pt-12 border-t border-zinc-900">
                                <AddReviewForm
                                    packageId={booking.packageId}
                                    bookingId={booking.id}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Summaries & Actions */}
                    <div className="space-y-8">
                        {/* Summary Card */}
                        <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
                            <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[100px] rounded-full transition-colors duration-1000 ${statusConfig.bgGlow}`} />

                            <div className="relative space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Transaction Summary</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black tracking-tighter">₹{booking.amount.toLocaleString()}</span>
                                        <span className="text-zinc-600 font-bold text-xs uppercase tracking-widest">INR</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500 font-bold uppercase tracking-widest">Service Fee</span>
                                        <span className="text-zinc-300 font-black">Included</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500 font-bold uppercase tracking-widest">Tax (GST)</span>
                                        <span className="text-zinc-300 font-black">Included</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                                        <span className="text-white font-bold uppercase tracking-widest text-[10px]">Reference ID</span>
                                        <span className="text-zinc-500 font-mono text-[10px] break-all">{booking.id.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[2rem] p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Payment Method</h4>
                                <p className="text-sm font-bold text-white tracking-tight leading-none uppercase">Stripe Secured Purchase</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-4">
                            {booking.status === 'pending' && (
                                <div className="space-y-4">
                                    <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 flex flex-col gap-3">
                                        <div className="flex items-center gap-2 text-amber-500">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Action Required</span>
                                        </div>
                                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                                            Your payment is still pending. Complete the transaction securely on Stripe to confirm your artistic experience.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleRetryPayment}
                                        disabled={retryingPayment}
                                        className="w-full py-5 rounded-[1.5rem] bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group shadow-[0_20px_50px_rgba(255,255,255,0.1)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 via-white to-amber-500 opacity-20" />
                                        {retryingPayment ? (
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        )}
                                        {retryingPayment ? "Redirecting..." : "Complete Secure Payment"}
                                    </button>
                                </div>
                            )}

                            {booking.status === 'completed' && (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => navigate(`${ROUTES.USER.CHAT}?bookingId=${booking.id}`)}
                                        className="w-full py-5 rounded-[1.5rem] bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-700 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group border border-zinc-700"
                                    >
                                        <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Chat with Creator
                                    </button>
                                    <button
                                        onClick={() => BookingService.downloadInvoice(sessionId!)}
                                        className="w-full py-5 rounded-[1.5rem] border border-zinc-700 bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group"
                                    >
                                        <Download className="w-4 h-4 group-hover:bounce" />
                                        Download Invoice
                                    </button>
                                </div>
                            )}

                            {((booking.status === 'completed' || booking.status === 'pending') && new Date(booking.bookingDate) > new Date()) && (
                                <button
                                    onClick={() => setIsCancelModalOpen(true)}
                                    className="w-full py-5 rounded-[1.5rem] border border-rose-500/20 bg-rose-500/5 text-rose-500 font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    <AlertCircle className="w-4 h-4 group-hover:animate-pulse" />
                                    Cancel Booking
                                </button>
                            )}

                            <p className="text-[10px] text-center text-zinc-600 font-medium px-4 leading-relaxed">
                                Cancellation terms apply. Confirmed bookings can be cancelled before the scheduled date. Refunds are processed according to our creative policies.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Assistance Section */}
                <div className="mt-32 pt-16 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-12 text-zinc-600">
                    <div className="max-w-sm space-y-4">
                        <h4 className="text-white font-bold text-sm tracking-wide">PHLO CONCIERGE</h4>
                        <p className="text-sm leading-relaxed">
                            Questions about your booking? Our dedicated experience team is standing by to ensure your session is nothing short of perfect.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-x-12 gap-y-6 text-[11px] font-bold tracking-[0.2em] uppercase">
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                        <a href="#" className="hover:text-white transition-colors">Policies</a>
                        <a href="#" className="hover:text-white transition-colors">Help Center</a>
                    </div>
                </div>
            </main>

            <ConfirmModal
                isOpen={isCancelModalOpen}
                onClose={() => !processingCancel && setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Confirm Cancellation"
                message="Are you sure you want to cancel this creative session ?"
                confirmLabel="Cancel Booking"
                cancelLabel="Keep Session"
                variant="danger"
                loading={processingCancel}
            />
        </div>
    );
};

export default BookingDetailPage;

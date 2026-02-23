import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { BookingService } from "@/services/user/bookingService";
import { UserBooking } from "@/interface/user/userBookingInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import UserNavbar from "@/compoents/reusable/userNavbar";

const BookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await BookingService.getUserBookings();
                if (response.success) {
                    setBookings(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const getStatusStyles = (status: UserBooking['status']) => {
        switch (status) {
            case 'completed':
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case 'pending':
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case 'cancelled':
                return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            default:
                return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            <UserNavbar />

            <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Dashboard
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                            MY <span className="text-zinc-500">BOOKINGS</span>
                        </h1>
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-zinc-900/50 rounded-3xl animate-pulse border border-zinc-800" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-zinc-900/30 rounded-[3rem] border border-zinc-800/50 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                            <Package className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">No bookings yet</h3>
                        <p className="text-zinc-500 max-w-sm mb-10 leading-relaxed">
                            Your collection of professional photography bookings will appear here. Start your creative journey today.
                        </p>
                        <button
                            onClick={() => navigate("/packages")}
                            className="bg-white text-black px-10 py-4 rounded-2xl font-bold text-sm tracking-tight hover:bg-zinc-200 transition-all hover:scale-[1.02]"
                        >
                            Browse Packages
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="group relative bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-[2.5rem] p-6 transition-all duration-500 ease-out flex items-center gap-8 overflow-hidden backdrop-blur-xl"
                            >
                                {/* Background Glow Effect */}
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 blur-[100px] rounded-full group-hover:bg-white/10 transition-colors" />

                                {/* Package Image */}
                                <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 rounded-2xl overflow-hidden bg-zinc-800">
                                    {booking.packageDetails?.images?.[0] ? (
                                        <S3Media
                                            s3Key={booking.packageDetails.images[0]}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-8 h-8 text-zinc-700" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-grow min-w-0 pr-4">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <span className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                        <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-medium tracking-wide">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 truncate group-hover:text-zinc-300 transition-colors">
                                        {booking.packageDetails?.title || "Unknown Package"}
                                    </h3>

                                    <div className="flex items-center gap-6">
                                        <div className="text-2xl font-black tracking-tighter">
                                            ₹{booking.amount.toLocaleString()}
                                        </div>
                                        <div className="hidden md:flex items-center gap-2 text-zinc-500 text-xs">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Full Package Access</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => navigate(`/packages/${booking.packageId}`)}
                                        className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Status specific hint for pending */}
                                {booking.status === 'pending' && (
                                    <div className="absolute top-4 right-20 flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-lg border border-amber-500/20">
                                        <AlertCircle className="w-3 h-3" />
                                        PAYMENT PENDING
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Section */}
                <div className="mt-20 pt-16 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-12 text-zinc-600">
                    <div className="max-w-sm space-y-4">
                        <h4 className="text-white font-bold text-sm tracking-wide">NEED ASSISTANCE?</h4>
                        <p className="text-sm leading-relaxed">
                            Our concierge team is available 24/7 to help you with your creative investments and booking inquiries.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-x-12 gap-y-6 text-[11px] font-bold tracking-[0.2em] uppercase">
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                        <a href="#" className="hover:text-white transition-colors">Policies</a>
                        <a href="#" className="hover:text-white transition-colors">Billing</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookingsPage;

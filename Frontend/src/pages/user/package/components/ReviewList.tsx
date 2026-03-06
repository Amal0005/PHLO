import React, { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare, Trash2, User as UserIcon } from "lucide-react";
import { ReviewService } from "@/services/user/reviewService";
import { Review } from "@/interface/user/reviewInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface ReviewListProps {
    packageId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ packageId }) => {
    const user = useSelector((state: RootState) => state.user.user);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await ReviewService.getPackageReviews(packageId);
            if (response.success) {
                setReviews(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    }, [packageId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleDeleteReview = async (reviewId: string) => {
        try {
            const response = await ReviewService.deleteReview(reviewId);
            if (response.success) {
                toast.success("Review deleted");
                fetchReviews();
            }
        } catch {
            toast.error("Failed to delete review");
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-white">Customer Reviews</h2>
                    <p className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-30 mt-1">
                        {reviews.length} Feedbacks
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xl font-black text-white">
                            {reviews.length > 0
                                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                : "0.0"}
                        </span>
                        <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-2 h-2 ${s <= (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1))
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-zinc-800"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full"
                        />
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={review.id}
                            className="p-5 rounded-xl transition-all duration-500 hover:bg-white/[0.02]"
                            style={{
                                border: "1px solid rgba(255, 255, 255, 0.04)"
                            }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
                                        {review.userPhoto ? (
                                            <S3Media s3Key={review.userPhoto} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-4 h-4 text-white/10" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-white uppercase">{review.userName}</h4>
                                        <p className="text-[8px] font-medium text-white/30 uppercase tracking-widest">
                                            {new Date(review.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className={`w-2 h-2 ${s <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-800"}`} />
                                        ))}
                                    </div>
                                    {user && user.id === review.userId && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="p-1.5 hover:bg-rose-500/10 rounded-lg group/del"
                                        >
                                            <Trash2 className="w-3 h-3 text-rose-500/40 group-hover/del:text-rose-400" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-[11px] leading-relaxed text-white/50 font-medium">
                                {review.comment}
                            </p>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl">
                        <MessageSquare className="w-6 h-6 text-white/5 mx-auto mb-3" />
                        <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">No reviews yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewList;

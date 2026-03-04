import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Package as PackageIcon, MapPin, X,
   Image as ImageIcon,
  Calendar, Check, AlertCircle, Loader2
} from "lucide-react";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import UserNavbar from "@/compoents/reusable/userNavbar";
import { BookingService } from "@/services/user/bookingService";
import { toast } from "react-toastify";
import LocationSearchBar from "@/pages/creator/package/components/locationSearchBar";
import ReviewList from "./components/ReviewList";

const PackageDetailPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<UserPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDateAvailable, setIsDateAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setLoading(true);
        const response = await UserPackageService.getPackageById(packageId!);
        if (response?.success) setPackageData(response.data);
      } catch (error) {
        console.error("Failed to fetch package details", error);
      } finally {
        setLoading(false);
      }
    };
    if (packageId) fetchPackageDetail();
  }, [packageId]);

  const handleBooking = async () => {
    if (!selectedDate) {
      toast.warning("Please select a booking date first.");
      return;
    }

    if (!selectedLocation.trim()) {
      toast.warning("Please enter a location");
      return;
    }

    if (isDateAvailable === false) {
      toast.error("This date is already booked. Please choose another date.");
      return;
    }

    try {
      const baseUrl = window.location.origin;
      const response = await BookingService.createBooking(packageId!, baseUrl, selectedDate, selectedLocation);
      if (response.url) window.location.href = response.url;
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : "Failed to initiate booking. Please try again.";
      toast.error(err);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    if (!date) {
      setIsDateAvailable(null);
      return;
    }

    try {
      setCheckingAvailability(true);
      const response = await BookingService.checkAvailability(packageId!, date);
      setIsDateAvailable(response.isAvailable);
    } catch (error) {
      console.error("Error checking availability:", error);
      setIsDateAvailable(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex items-center gap-2">
          {[0, 150, 300].map((d, i) => (
            <div key={i} className="w-1 bg-white animate-pulse rounded-full"
              style={{ height: i === 1 ? 40 : 24, animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="h-screen bg-[#080808] flex flex-col items-center justify-center gap-4">
        <PackageIcon className="w-12 h-12 text-zinc-700" />
        <p className="text-zinc-400 text-sm tracking-widest uppercase">Package not found</p>
        <button onClick={() => navigate(-1)}
          className="px-6 py-2 border border-zinc-700 text-white text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all">
          Go Back
        </button>
      </div>
    );
  }

  const totalImages = packageData.images?.length || 0;
  const currentBg = totalImages > 0 ? packageData.images[selectedImage] : null;

  return (
    <>
      <div
        className="min-h-screen lg:h-screen text-white flex flex-col overflow-y-auto lg:overflow-hidden relative"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ── BACKGROUND ── */}
        <div className="absolute inset-0 z-0">
          {currentBg ? (
            <S3Media
              s3Key={currentBg}
              alt="bg"
              className="w-full h-full object-cover transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full bg-zinc-950" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
          <div className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px",
            }}
          />
        </div>

        {/* ── NAVBAR ── */}
        <div className="relative z-20">
          <UserNavbar />
        </div>

        <div className="flex-shrink-0 h-16 lg:h-20" />

        {/* ── MAIN LAYOUT ── */}
        <div className="relative z-10 flex-1 flex flex-col lg:overflow-hidden">

          <div className="px-4 sm:px-10 lg:px-16 pt-3 lg:pt-4 pb-2 flex-shrink-0">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 group">
              <ArrowLeft className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
                Back to Explore
              </span>
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row lg:items-stretch justify-between px-4 sm:px-10 lg:px-16 pb-8 pt-2 lg:overflow-hidden gap-8" style={{ minHeight: 0 }}>

            {/* ── LEFT GLASS PANEL ── */}
            <div
              className="flex flex-col w-full lg:w-[540px] flex-shrink-0 lg:h-full rounded-3xl overflow-hidden"
              style={{
                background: "rgba(20, 20, 20, 0.4)",
                backdropFilter: "blur(32px) saturate(1.5)",
                WebkitBackdropFilter: "blur(32px) saturate(1.5)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex flex-col flex-1 overflow-y-auto p-5 sm:p-8 lg:p-9 lg:pb-16" style={{ scrollbarWidth: "none" }}>

                <div className="mb-5">
                  <span className="inline-block px-3 py-1 rounded-full text-[8px] font-bold tracking-[0.35em] uppercase"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.45)",
                      border: "1px solid rgba(255,255,255,0.09)"
                    }}>
                    {typeof packageData.category === "object" ? packageData.category.name : packageData.category}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 mb-5">
                  <h1
                    className="font-black uppercase text-white flex-1"
                    style={{ fontSize: "clamp(1.4rem, 2vw, 1.9rem)", letterSpacing: "-0.03em", lineHeight: "1.02" }}
                  >
                    {packageData.title}
                  </h1>
                </div>

                {typeof packageData.creatorId === "object" && (
                  <div className="flex items-center gap-3 mb-5 pb-5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                      style={{ border: "1.5px solid rgba(255,255,255,0.13)" }}>
                      {packageData.creatorId.profilePhoto ? (
                        <S3Media s3Key={packageData.creatorId.profilePhoto} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white font-black text-sm">
                          {packageData.creatorId.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.88)" }}>
                        {packageData.creatorId.fullName}
                      </div>
                      {packageData.locations && packageData.locations.length > 0 && (
                        <div className="flex flex-col gap-2 mt-1">
                          {packageData.locations.map((loc, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <MapPin className="w-2.5 h-2.5" style={{ color: "rgba(255,255,255,0.28)" }} />
                              <span className="text-[10px] uppercase tracking-widest leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                                {loc.placeName}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-[8px] font-bold tracking-[0.4em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.28)" }}>
                    Overview
                  </p>
                  <p className="text-[11px] leading-[1.7] break-words" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {packageData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-7">
                  {[
                    {
                      label: "Established",
                      value: new Date(packageData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    },
                    { label: "Assets", value: `${totalImages} Photos` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-2xl p-4"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-[8px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.28)" }}>
                        {label}
                      </p>
                      <p className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.88)" }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Date Picker + Booking Action */}
                <div className="pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {/* Date & Location Capture */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold tracking-[0.3em] uppercase ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Select Booking Date
                      </label>
                      <div className="relative group/date">
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={selectedDate}
                          onClick={(e) => e.currentTarget.showPicker()}
                          onChange={(e) => handleDateChange(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          style={{ colorScheme: 'dark' }}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Calendar className="w-4 h-4 text-white/40 group-hover/date:text-white/70 transition-colors" />
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                          {checkingAvailability && (
                            <Loader2 className="w-3.5 h-3.5 text-white/20 animate-spin" />
                          )}
                          {!checkingAvailability && selectedDate && isDateAvailable === true && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Available</span>
                            </div>
                          )}
                          {!checkingAvailability && selectedDate && isDateAvailable === false && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
                              <AlertCircle className="w-3 h-3 text-rose-500" />
                              <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Booked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold tracking-[0.3em] uppercase ml-1" style={{ color: "rgba(255,255,255,0.15)" }}>
                        Location
                      </label>
                      <div className="relative group/loc">
                        <LocationSearchBar
                          onChange={(location) => setSelectedLocation(location.placeName || "")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-6">
                    <div>
                      <p className="text-[8px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                        Starting from
                      </p>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[11px] font-semibold mr-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>₹</span>
                        <span className="font-black text-white" style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)", letterSpacing: "-0.04em" }}>
                          {packageData.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleBooking}
                      disabled={checkingAvailability || isDateAvailable === false}
                      className={`px-8 py-3.5 font-bold text-[11px] tracking-[0.15em] uppercase rounded-2xl transition-all active:scale-95 whitespace-nowrap ${isDateAvailable === false ? 'opacity-50 cursor-not-allowed grayscale' : 'bg-white text-black hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)]'
                        }`}
                      style={{ boxShadow: "0 8px 32px rgba(255,255,255,0.12)" }}
                    >
                      {isDateAvailable === false ? 'Already Booked' : 'Confirm & Pay'}
                    </button>
                  </div>
                </div>

                {/* ── REVIEWS ── */}
                <ReviewList packageId={packageId!} />
              </div>
            </div>

            {/* ── Mobile Strip ── */}
            {totalImages > 1 && (
              <div className="flex lg:hidden items-center gap-2.5 w-full overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {packageData.images.slice(0, 5).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                      width: 64, height: 48,
                      border: selectedImage === index ? "2px solid rgba(255,255,255,0.85)" : "2px solid rgba(255,255,255,0.08)",
                      opacity: selectedImage === index ? 1 : 0.4,
                    }}
                  >
                    <S3Media s3Key={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ── Desktop Strip ── */}
            {totalImages > 0 && (
              <div className="hidden lg:flex flex-col justify-between flex-shrink-0 py-1" style={{ minHeight: 0 }}>
                <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 py-3 mt-2" style={{ scrollbarWidth: "none" }}>
                  {packageData.images.slice(0, 7).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300"
                      style={{
                        width: 62, height: 48,
                        border: selectedImage === index ? "2px solid rgba(255,255,255,0.85)" : "2px solid rgba(255,255,255,0.08)",
                        opacity: selectedImage === index ? 1 : 0.38,
                        transform: selectedImage === index ? "scale(1.07)" : "scale(1)",
                        boxShadow: selectedImage === index ? "0 6px 24px rgba(0,0,0,0.6)" : "none",
                      }}
                    >
                      <S3Media s3Key={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowGallery(true)}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl transition-all hover:opacity-80 mt-2"
                  style={{
                    width: 62, height: 44,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    backdropFilter: "blur(10px)",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span style={{ fontSize: 7, letterSpacing: "0.15em", fontWeight: 700 }}>ALL</span>
                </button>
              </div>
            )}

            {/* ── Dots ── */}
            {totalImages > 1 && (
              <div className="hidden lg:block absolute bottom-10 z-20 pointer-events-none"
                style={{ left: "calc(600px + ((100% - 600px - 62px) / 2) + 40px)", transform: "translateX(-50%)" }}>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(totalImages, 8) }).map((_, i) => (
                    <div key={i} className="rounded-full transition-all duration-300"
                      style={{
                        width: selectedImage === i ? 18 : 5,
                        height: 5,
                        background: selectedImage === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.22)",
                      }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── GALLERY MODAL ── */}
      {showGallery && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(24px)" }}>
          <div className="min-h-screen p-4 sm:p-10">
            <div className="max-w-5xl mx-auto mb-6 sm:mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight uppercase text-white">{packageData.title}</h3>
                <p className="text-[10px] tracking-widest uppercase mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{totalImages} photos</p>
              </div>
              <button onClick={() => setShowGallery(false)} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
              </button>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {packageData.images?.map((img, index) => (
                <button key={index} onClick={() => { setSelectedImage(index); setShowGallery(false); }} className="group relative aspect-square rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02]" style={{ border: selectedImage === index ? "2px solid rgba(255,255,255,0.75)" : "2px solid rgba(255,255,255,0.05)" }}>
                  <S3Media s3Key={img} alt={`${packageData.title} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageDetailPage;
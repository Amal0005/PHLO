import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Package as PackageIcon, MapPin, X,
  Image as ImageIcon,
  Check, AlertCircle, Loader2
} from "lucide-react";
import { format } from "date-fns";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { ROUTES } from "@/constants/routes";
import { S3Media } from "@/components/reusable/s3Media";
import UserNavbar from "@/components/reusable/userNavbar";
import { BookingService } from "@/services/user/bookingService";
import { toast } from "react-toastify";
import LocationSearchBar from "@/pages/creator/package/components/locationSearchBar";
import type { LocationSearchBarHandle } from "@/pages/creator/package/components/locationSearchBar";
import ReviewList from "@/pages/user/package/components/ReviewList";
import { CustomCalendar } from "@/components/reusable/CustomCalendar";
import Map, { Marker } from 'react-map-gl/mapbox';
import CancellationPolicyModal from "@/pages/user/package/components/CancellationPolicyModal";
import LogoLoading from "@/components/reusable/LogoLoading";


import 'mapbox-gl/dist/mapbox-gl.css';
import type { Map as MapboxMap } from 'mapbox-gl';

const PackageDetailPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<UserPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  // const [showGallery, setShowGallery] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDateAvailable, setIsDateAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [markerLoc, setMarkerLoc] = useState<{ lat: number, lng: number } | null>(null);
  const locationBarRef = React.useRef<LocationSearchBarHandle>(null);
  const galleryRef = React.useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState<number | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const [viewState, setViewState] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 3.5,
    pitch: 60,
    bearing: 0,
  });

  useEffect(() => {
    const fetchPackageDetail = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        const response = await UserPackageService.getPackageById(packageId!);
        if (response?.success) setPackageData(response.data);
      } catch (error: unknown) {
        console.error("Failed to fetch package details", error);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minTime = 1200; // Snappy branding delay
        setTimeout(() => {
          setLoading(false);
        }, Math.max(0, minTime - elapsedTime));
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

    setShowPolicyModal(true);
  };

  const confirmBooking = async () => {
    try {
      setShowPolicyModal(false);
      const baseUrl = window.location.origin;
      const response = await BookingService.createBooking(packageId!, baseUrl, selectedDate, selectedLocation);
      if (response.url) window.location.href = response.url;
    } catch (error: unknown) {
      const err = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error).message || "Failed to initiate booking. Please try again.";
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
    return <LogoLoading fullScreen={true} />;
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
        className="min-h-screen text-white flex flex-col relative overflow-x-hidden overflow-y-auto"
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
        <div className="relative z-10 flex-1 flex flex-col">

          <div className="px-4 sm:px-10 lg:px-16 pt-3 lg:pt-4 pb-2 flex-shrink-0">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 group">
              <ArrowLeft className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
                Back to Explore
              </span>
            </button>
          </div>

          <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-stretch justify-between px-4 sm:px-10 lg:px-16 pb-8 pt-2 gap-8" style={{ minHeight: 0 }}>

            {/* ── LEFT GLASS PANEL ── */}
            <div
              className="flex flex-col w-full lg:w-[760px] flex-shrink-0 rounded-[56px] relative"
              style={{
                background: "rgba(10, 10, 10, 0.45)",
                backdropFilter: "blur(50px) saturate(2)",
                WebkitBackdropFilter: "blur(50px) saturate(2)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 80px 180px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Decorative Floating Gallery Overlap */}
              <div className="absolute -right-32 top-24 hidden lg:flex flex-col gap-12 z-30">
                {packageData.images?.slice(0, 3).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-52 h-36 rounded-[40px] overflow-hidden border-2 transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,1)] ${selectedImage === idx ? 'border-[#E2B354] scale-110 -translate-x-16' : 'border-white/10 opacity-70 hover:opacity-100'}`}
                  >
                    <S3Media s3Key={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex flex-col p-6 sm:p-10 lg:p-12 relative z-10">

                <div className="mb-3">
                  <span className="inline-block px-3 py-1 rounded-full text-[8px] font-bold tracking-[0.35em] uppercase"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.45)",
                      border: "1px solid rgba(255,255,255,0.09)"
                    }}>
                    {packageData.category && typeof packageData.category === "object" ? (packageData.category as any).name : packageData.category}
                  </span>
                </div>

                <div className="flex flex-col gap-4 mb-5">
                  <h1
                    className="font-[950] uppercase text-[#E2B354] leading-[0.9]"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.04em" }}
                  >
                    {packageData.title}
                  </h1>
                  <div className="flex items-baseline gap-4">
                    <span className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black italic">Starting from</span>
                    <div className="inline-flex flex-col">
                      <span className="text-3xl font-[950] text-white tracking-tighter">₹ {packageData.price.toLocaleString()}</span>
                      <div className="h-0.5 w-[75%] bg-[#E2B354] mt-2 rounded-full shadow-[0_0_15px_#E2B354]" />
                    </div>
                  </div>
                </div>

                {packageData.creatorId && typeof packageData.creatorId === "object" && (
                  <div 
                    onClick={() => navigate(ROUTES.USER.CREATOR_DETAIL.replace(':id', (packageData.creatorId as any)._id))}
                    className="flex items-center gap-4 mb-5 pb-4 cursor-pointer group/creator"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 transition-transform group-hover/creator:scale-110"
                      style={{ border: "1.5px solid rgba(255,255,255,0.13)" }}>
                      {(packageData.creatorId as any).profilePhoto ? (
                        <S3Media s3Key={(packageData.creatorId as any).profilePhoto} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white font-black text-[10px]">
                          {(packageData.creatorId as any).fullName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[14px] font-bold text-white mb-1 group-hover/creator:text-[#E2B354] transition-colors">
                        {(packageData.creatorId as any).fullName}
                      </div>
                      {packageData.locations && packageData.locations.length > 0 && (
                        <div className="flex flex-col gap-0.5">
                          {packageData.locations.map((loc, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <MapPin className="w-2.5 h-2.5 opacity-30" />
                              <span className="text-[9px] uppercase tracking-widest text-white/40 font-medium">
                                {loc.placeName}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mb-6 max-w-[480px]">
                  <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-2 text-[#E2B354]/60">
                    Overview
                  </p>
                  <p className="text-[13px] leading-[1.8] text-white/50 font-medium break-words whitespace-pre-line text-justify">
                    {packageData.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 items-stretch">
                  <div className="relative flex flex-col justify-center">
                    <CustomCalendar
                      selectedDate={selectedDate ? new Date(selectedDate) : undefined}
                      onChange={(date) => {
                        if (!date) {
                          handleDateChange("");
                          return;
                        }
                        handleDateChange(format(date, "yyyy-MM-dd"));
                      }}
                      minDate={new Date(new Date().setHours(24, 0, 0, 0))}
                      placeholder="Select Date"
                      className="w-full"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2 z-10">
                      {checkingAvailability && (
                        <Loader2 className="w-3.5 h-3.5 text-white/40 animate-spin" />
                      )}
                      {!checkingAvailability && selectedDate && isDateAvailable === true && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                      )}
                      {!checkingAvailability && selectedDate && isDateAvailable === false && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl">
                          <AlertCircle className="w-3 h-3 text-rose-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center px-1">
                    <p className="text-[8px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.22)" }}>
                      Published
                    </p>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-white">
                      {new Date(packageData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 mb-2">
                  <p className="text-[8px] font-bold tracking-[0.3em] uppercase mb-2 ml-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Event Location
                  </p>
                  <div className="flex items-stretch gap-3">
                    <div className="w-full max-w-[320px] relative">
                      <LocationSearchBar
                        ref={locationBarRef}
                        onChange={(location: { placeName?: string; latitude?: number; longitude?: number }) => {
                          setSelectedLocation(location.placeName || "");
                          if (location.latitude && location.longitude) {
                            setViewState(prev => ({
                              ...prev,
                              latitude: location.latitude || prev.latitude,
                              longitude: location.longitude || prev.longitude,
                              zoom: 13,
                            }));

                            setMarkerLoc({ lat: location.latitude || 0, lng: location.longitude || 0 });
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={() => setShowMap(true)}
                      className="px-6 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all hover:bg-[#E2B354]/10 hover:border-[#E2B354]/40 hover:text-[#E2B354] active:scale-95 flex-shrink-0"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{selectedLocation ? "Map" : "Map"}</span>
                    </button>
                  </div>

                  {selectedLocation && (
                    <div className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <MapPin className="w-2.5 h-2.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                      <span className="text-[10px] text-white/60 truncate">{selectedLocation}</span>
                    </div>
                  )}
                </div>

                {/* Date Picker + Booking Action */}
                <div className="pt-4 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {/* Date & Location Capture */}


                  {/* Booking Action */}
                  <div className="pt-6 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button
                      onClick={handleBooking}
                      disabled={checkingAvailability || isDateAvailable === false}
                      className="w-full h-16 rounded-2xl border-2 border-[#E2B354]/30 bg-transparent text-[#E2B354] font-[950] text-[13px] uppercase tracking-[0.6em] hover:bg-[#E2B354] hover:text-black transition-all active:scale-[0.99] disabled:opacity-30 flex items-center justify-center shadow-2xl shadow-[#E2B354]/10"
                    >
                      {checkingAvailability ? 'Checking...' : isDateAvailable === false ? 'Unavailable' : 'Confirm & Pay'}
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Mobile Strip Only */}
            {totalImages > 1 && (
              <div className="flex lg:hidden items-center gap-2.5 w-full overflow-x-auto pb-4 pt-10 px-4" style={{ scrollbarWidth: "none" }}>
                {packageData.images?.slice(0, 5).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                      width: 80, height: 60,
                      border: selectedImage === index ? "2px solid #E2B354" : "1px solid rgba(255,255,255,0.1)",
                      opacity: selectedImage === index ? 1 : 0.4,
                    }}
                  >
                    <S3Media s3Key={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── MEDIA COLLECTION / GALLERY SECTION ── */}
          <div ref={galleryRef} className="flex flex-col px-4 sm:px-10 lg:px-16 pt-24 pb-12">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex flex-col mb-16 px-4">
                <span className="text-[#E2B354] text-[10px] font-black uppercase tracking-[0.5em] mb-4">Gallery</span>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <h2 className="text-4xl lg:text-7xl font-[950] uppercase tracking-tighter text-white leading-none">
                    Media Collection
                  </h2>
                  <p className="text-white/30 text-xs font-medium uppercase tracking-widest lg:max-w-xs">
                    Explore the complete visual journey of this package with {totalImages} cinematic shots.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packageData.images?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageModal(index)}
                    className={`group relative aspect-[16/10] rounded-[48px] overflow-hidden border-2 transition-all duration-700 hover:scale-[1.03] shadow-2xl ${selectedImage === index ? 'border-[#E2B354] ring-8 ring-[#E2B354]/10' : 'border-white/5 opacity-80 hover:opacity-100'}`}
                  >
                    <S3Media s3Key={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-[#E2B354] text-[8px] font-black uppercase tracking-[0.4em]">View Full Size</span>
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Image {index + 1}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── REVIEWS SECTION ── */}
          <div className="flex flex-col px-4 sm:px-10 lg:px-16 pb-20 pt-10">
            <div
              className="w-full max-w-4xl mx-auto p-10 rounded-[3rem]"
              style={{
                background: "rgba(20, 20, 20, 0.4)",
                backdropFilter: "blur(40px) saturate(2)",
                WebkitBackdropFilter: "blur(40px) saturate(2)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
              }}
            >
              <ReviewList packageId={packageId!} />
            </div>
          </div>
        </div>

        {/* ── FULL SCREEN IMAGE VIEWER MODAL ── */}
        {selectedImageModal !== null && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
            {/* Modal Header/Controls */}
            <div className="absolute top-0 inset-x-0 h-24 flex items-center justify-between px-8 lg:px-16 z-20">
              <div className="flex flex-col">
                <span className="text-[#E2B354] text-[8px] font-black uppercase tracking-[0.4em]">Cinematic View</span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Image {selectedImageModal + 1} of {totalImages}</span>
              </div>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image View */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-24">
              <div className="relative w-full h-full flex items-center justify-center group">
                <S3Media
                  s3Key={packageData.images[selectedImageModal]}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageModal(prev => (prev! > 0 ? prev! - 1 : totalImages - 1));
                  }}
                  className="absolute left-4 lg:left-12 w-16 h-16 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-[#E2B354]/20 hover:border-[#E2B354]/30 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageModal(prev => (prev! < totalImages - 1 ? prev! + 1 : 0));
                  }}
                  className="absolute right-4 lg:right-12 w-16 h-16 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-[#E2B354]/20 hover:border-[#E2B354]/30 transition-all opacity-0 group-hover:opacity-100"
                >
                  <div className="rotate-180"><ArrowLeft className="w-6 h-6" /></div>
                </button>
              </div>
            </div>

            {/* Bottom Preview Strip */}
            <div className="h-32 bg-black/40 border-t border-white/5 flex items-center justify-center gap-3 px-8">
              {packageData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageModal(idx)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImageModal === idx ? 'border-[#E2B354] scale-110 shadow-lg shadow-[#E2B354]/20' : 'border-transparent opacity-30 hover:opacity-60'}`}
                >
                  <S3Media s3Key={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INTEGRATED INTO PAGE SECTION ABOVE */}
      </div>

      {/* ── MAP PICKER MODAL ── */}
      {showMap && (
        <div className="fixed inset-0 z-[70] flex flex-col" style={{ background: "rgba(0,0,0,0.95)" }}>
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 relative z-10"
            style={{ background: "rgba(5,5,5,0.9)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(30px)" }}>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.12)" }}>
                <MapPin className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <h3 className="text-white font-black text-[15px] tracking-tight">Pick Event Location</h3>
                <p className="text-[9px] text-white/30 tracking-widest uppercase mt-0.5">3D Map · Click to drop a pin</p>
              </div>
            </div>
            <button
              onClick={() => setShowMap(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Satellite 3D Map */}
          <div className="flex-1 relative">
            {import.meta.env.VITE_MAPBOX_TOKEN ? (
              <Map
                {...viewState}
                onMove={(evt: { viewState: typeof viewState }) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
                antialias={true}
                onLoad={(evt: { target: MapboxMap }) => {
                  const map = evt.target;
                  // Add Mapbox terrain for true 3D elevation
                  if (!map.getSource('mapbox-dem')) {
                    map.addSource('mapbox-dem', {
                      type: 'raster-dem',
                      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                      tileSize: 512,
                      maxzoom: 14,
                    });
                    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                  }
                  // Add atmospheric sky layer
                  if (!map.getLayer('sky')) {
                    map.addLayer({
                      id: 'sky',
                      type: 'sky',
                      paint: {
                        'sky-type': 'atmosphere',
                        'sky-atmosphere-sun': [0.0, 90.0],
                        'sky-atmosphere-sun-intensity': 15,
                      },
                    });
                  }
                }}
                onClick={async (e: { lngLat: { lat: number; lng: number } }) => {
                  const { lat, lng } = e.lngLat;
                  setMarkerLoc({ lat, lng });
                  // Zoom into clicked spot with steep pitch for Google Earth feel
                  setViewState(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                    zoom: 16,
                    pitch: 60,
                    bearing: prev.bearing,
                  }));
                  try {
                    const token = import.meta.env.VITE_MAPBOX_TOKEN;
                    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&types=place,address&limit=1`);
                    const data = await res.json();
                    if (data.features?.[0]) {
                      const placeName = data.features[0].place_name;
                      setSelectedLocation(placeName);
                      locationBarRef.current?.setInput(placeName);
                    }
                  } catch (error) {
                    console.error("Reverse geocoding error:", error);
                  }
                }}
              >
                {markerLoc && (
                  <Marker latitude={markerLoc.lat} longitude={markerLoc.lng}>
                    <div className="flex flex-col items-center" style={{ transform: "translateY(-100%)" }}>
                      {/* Outer pulse */}
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-12 h-12 rounded-full bg-red-500/20 animate-ping" />
                        <div className="absolute w-8 h-8 rounded-full bg-red-500/30" />
                        {/* Pin head */}
                        <div className="w-5 h-5 rounded-full bg-white border-[3px] border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.9)] relative z-10" />
                      </div>
                      {/* Stem */}
                      <div className="w-0.5 h-5 bg-gradient-to-b from-red-500 via-red-400 to-transparent" />
                      {/* Ground shadow */}
                      <div className="w-4 h-1.5 rounded-full bg-black/50 blur-sm" />
                    </div>
                  </Marker>
                )}
              </Map>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 text-white/30 text-[10px] uppercase tracking-widest px-12 text-center">
                Map Unavailable: Missing API Key
              </div>
            )}

            {/* Floating confirm card at bottom */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-md px-6">
              {selectedLocation && markerLoc ? (
                <div className="w-full rounded-3xl overflow-hidden"
                  style={{ background: "rgba(8,8,8,0.88)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(30px)", boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}>
                  <div className="px-5 py-4 flex items-center gap-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.08)" }}>
                      <MapPin className="w-3.5 h-3.5 text-white/60" />
                    </div>
                    <p className="text-[11px] text-white/70 font-medium truncate flex-1">{selectedLocation}</p>
                  </div>
                  <div className="p-3">
                    <button
                      onClick={() => setShowMap(false)}
                      className="w-full py-3.5 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase bg-white text-black hover:bg-zinc-100 transition-all active:scale-[0.98]"
                      style={{ boxShadow: "0 8px 40px rgba(255,255,255,0.15)" }}
                    >
                      ✓ Confirm Location
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-3 rounded-full text-[9px] font-bold tracking-[0.3em] uppercase"
                  style={{ background: "rgba(8,8,8,0.75)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", color: "rgba(255,255,255,0.35)" }}>
                  Tap anywhere on the map to select a location
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Floating Gallery Button - Bottom Right */}
      <button
        onClick={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })}
        className="fixed bottom-10 right-10 z-[60] w-24 h-24 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 flex flex-col items-center justify-center gap-1.5 hover:bg-[#E2B354] hover:text-black transition-all shadow-[0_30px_100px_rgba(0,0,0,0.8)] group active:scale-95"
      >
        <div className="absolute inset-0 rounded-full bg-[#E2B354]/10 animate-ping group-hover:hidden" />
        <ImageIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="text-[9px] font-black uppercase tracking-widest">Gallery</span>
      </button>
      <CancellationPolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        onConfirm={confirmBooking}
      />
    </>
  );
};

export default PackageDetailPage;


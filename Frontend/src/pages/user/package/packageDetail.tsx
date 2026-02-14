// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { ArrowLeft, Package as PackageIcon } from "lucide-react";
// // import { UserPackageService } from "@/services/user/userPackageService";
// // import { UserPackage } from "@/interface/user/userPackageInterface";
// // import { S3Media } from "@/compoents/reusable/s3Media";
// // import UserNavbar from "@/compoents/reusable/userNavbar";

// // const PackageDetailPage: React.FC = () => {
// //   const { packageId } = useParams<{ packageId: string }>();
// //   const navigate = useNavigate();
// //   const [packageData, setPackageData] = useState<UserPackage | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedImage, setSelectedImage] = useState(0);

// //   useEffect(() => {
// //     if (packageId) {
// //       fetchPackageDetail();
// //     }
// //   }, [packageId]);

// //   const fetchPackageDetail = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await UserPackageService.getPackageById(packageId!);
// //       if (response?.success) {
// //         setPackageData(response.data);
// //       }
// //     } catch (error) {
// //       console.error("Failed to fetch package details", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-black text-white flex items-center justify-center">
// //         <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
// //       </div>
// //     );
// //   }

// //   if (!packageData) {
// //     return (
// //       <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
// //         <PackageIcon size={48} className="text-gray-600 mb-4" />
// //         <h3 className="text-2xl font-black mb-2">Package Not Found</h3>
// //         <button
// //           onClick={() => navigate(-1)}
// //           className="px-6 py-3 bg-white text-black rounded-xl font-bold mt-4"
// //         >
// //           Go Back
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-black text-white">
// //       <UserNavbar />

// //       <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
// //         {/* Back Button */}
// //         <button
// //           onClick={() => navigate(-1)}
// //           className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
// //         >
// //           <ArrowLeft size={20} />
// //           <span className="font-bold">Back to Packages</span>
// //         </button>

// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// //           {/* Image Gallery */}
// //           <div>
// //             {/* Main Image */}
// //             <div className="h-96 bg-zinc-900 rounded-3xl overflow-hidden mb-4">
// //               {packageData.images?.length > 0 ? (
// //                 <S3Media
// //                   s3Key={packageData.images[selectedImage]}
// //                   className="w-full h-full object-cover"
// //                 />
// //               ) : (
// //                 <div className="w-full h-full flex items-center justify-center text-gray-700">
// //                   <PackageIcon size={60} />
// //                 </div>
// //               )}
// //             </div>

// //             {/* Thumbnail Gallery */}
// //             {packageData.images?.length > 1 && (
// //               <div className="grid grid-cols-4 gap-4">
// //                 {packageData.images.map((img, index) => (
// //                   <button
// //                     key={index}
// //                     onClick={() => setSelectedImage(index)}
// //                     className={`h-24 bg-zinc-900 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === index
// //                         ? "border-white"
// //                         : "border-white/10 hover:border-white/30"
// //                       }`}
// //                   >
// //                     <S3Media s3Key={img} className="w-full h-full object-cover" />
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Package Details */}
// //           <div>
// //             {/* Category Badge */}
// //             <span className="inline-block px-4 py-2 bg-white/10 text-white text-sm font-bold rounded-full mb-4">
// //               {typeof packageData.category === 'object' ? packageData.category.name : packageData.category}
// //             </span>

// //             <h1 className="text-5xl font-black mb-4">{packageData.title}</h1>

// //             {/* Creator Info */}
// //             {typeof packageData.creatorId === 'object' && (
// //               <div className="text-lg text-gray-400 mb-6">
// //                 by <span className="text-white font-semibold">{packageData.creatorId.fullName}</span>
// //                 {packageData.creatorId.city && <span> • {packageData.creatorId.city}</span>}
// //               </div>
// //             )}

// //             <div className="text-4xl font-black mb-8">
// //               ₹ {packageData.price.toLocaleString()}
// //             </div>

// //             <div className="mb-8">
// //               <h3 className="text-xl font-black mb-3">Description</h3>
// //               <p className="text-gray-400 leading-relaxed">
// //                 {packageData.description}
// //               </p>
// //             </div>

// //             {/* Call to Action */}
// //             <div className="space-y-4">
// //               <button className="w-full px-6 py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-gray-200 transition-colors">
// //                 Book This Package
// //               </button>
// //               <button className="w-full px-6 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-colors">
// //                 Contact Creator
// //               </button>
// //             </div>

// //             {/* Package Info */}
// //             <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
// //               <h4 className="font-black mb-4">Package Information</h4>
// //               <div className="space-y-2 text-sm">
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-400">Created</span>
// //                   <span className="font-bold">
// //                     {new Date(packageData.createdAt).toLocaleDateString()}
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-400">Last Updated</span>
// //                   <span className="font-bold">
// //                     {new Date(packageData.updatedAt).toLocaleDateString()}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default PackageDetailPage;



// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Package as PackageIcon } from "lucide-react";
// import { UserPackageService } from "@/services/user/userPackageService";
// import { UserPackage } from "@/interface/user/userPackageInterface";
// import { S3Media } from "@/compoents/reusable/s3Media";
// import UserNavbar from "@/compoents/reusable/userNavbar";

// const PackageDetailPage: React.FC = () => {
//   const { packageId } = useParams<{ packageId: string }>();
//   const navigate = useNavigate();
//   const [packageData, setPackageData] = useState<UserPackage | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);

//   useEffect(() => {
//     if (packageId) {
//       fetchPackageDetail();
//     }
//   }, [packageId]);

//   const fetchPackageDetail = async () => {
//     try {
//       setLoading(true);
//       const response = await UserPackageService.getPackageById(packageId!);
//       if (response?.success) {
//         setPackageData(response.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch package details", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-white text-lg">Loading...</div>
//       </div>
//     );
//   }

//   if (!packageData) {
//     return (
//       <div className="min-h-screen bg-black flex flex-col items-center justify-center">
//         <PackageIcon className="w-16 h-16 text-gray-600 mb-4" />
//         <h2 className="text-white text-2xl mb-2">Package Not Found</h2>
//         <button
//           onClick={() => navigate(-1)}
//           className="px-6 py-3 bg-white text-black rounded-xl font-bold mt-4"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <UserNavbar />
      
//       {/* Hero Section with Image */}
//       <div className="relative w-full h-[70vh] overflow-hidden">
//         {/* Main Hero Image */}
//         {packageData.images?.length > 0 ? (
//           <S3Media
//             s3Key={packageData.images[selectedImage]}
//             alt={packageData.title}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
//             <PackageIcon className="w-24 h-24 text-gray-700" />
//           </div>
//         )}
        
//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
//         {/* Back Button - Floating */}
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all border border-white/10"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span className="text-sm font-medium">Back</span>
//         </button>

//         {/* Thumbnail Navigation - Floating */}
//         {packageData.images?.length > 1 && (
//           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-md rounded-full p-2 border border-white/10">
//             {packageData.images.map((img, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedImage(index)}
//                 className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
//                   selectedImage === index
//                     ? "border-white scale-110"
//                     : "border-white/30 hover:border-white/60 opacity-70 hover:opacity-100"
//                 }`}
//               >
//                 <S3Media
//                   s3Key={img}
//                   alt={`${packageData.title} ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 pb-12">
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Left Column - Main Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Card with main info */}
//             <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-xs font-medium text-gray-300 border border-white/20">
//                   {typeof packageData.category === 'object'
//                     ? packageData.category.name
//                     : packageData.category}
//                 </div>
//               </div>

//               <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
//                 {packageData.title}
//               </h1>

//               {typeof packageData.creatorId === 'object' && (
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
//                     {packageData.creatorId.fullName.charAt(0)}
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-400">Created by</div>
//                     <div className="font-semibold text-white">
//                       {packageData.creatorId.fullName}
//                       {packageData.creatorId.city && (
//                         <span className="text-gray-400 font-normal"> • {packageData.creatorId.city}</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="border-t border-white/10 pt-6">
//                 <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
//                   <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
//                   About This Package
//                 </h2>
//                 <p className="text-gray-300 leading-relaxed">
//                   {packageData.description}
//                 </p>
//               </div>
//             </div>

//             {/* Package Information Card */}
//             <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
//               <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                 <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
//                 Package Details
//               </h3>
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-1">
//                   <div className="text-xs text-gray-500 uppercase tracking-wider">Created</div>
//                   <div className="text-white font-medium">
//                     {new Date(packageData.createdAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </div>
//                 </div>
//                 <div className="space-y-1">
//                   <div className="text-xs text-gray-500 uppercase tracking-wider">Last Updated</div>
//                   <div className="text-white font-medium">
//                     {new Date(packageData.updatedAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Sticky Booking Card */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-24 bg-gradient-to-br from-zinc-900 to-black backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
//               <div className="mb-6">
//                 <div className="text-sm text-gray-400 mb-2">Package Price</div>
//                 <div className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
//                   ₹ {packageData.price.toLocaleString()}
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <button className="w-full bg-white text-black py-4 px-6 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
//                   Book This Package
//                 </button>
//                 <button className="w-full bg-white/10 text-white py-4 px-6 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm">
//                   Contact Creator
//                 </button>
//               </div>

//               <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
//                 <div className="flex items-center gap-3 text-sm text-gray-400">
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   <span>Instant booking confirmation</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-gray-400">
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <span>Flexible scheduling</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-gray-400">
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                   </svg>
//                   <span>Secure payment</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PackageDetailPage;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package as PackageIcon, MapPin, Calendar, Image as ImageIcon, X, User } from "lucide-react";
import { UserPackageService } from "@/services/user/userPackageService";
import { UserPackage } from "@/interface/user/userPackageInterface";
import { S3Media } from "@/compoents/reusable/s3Media";
import UserNavbar from "@/compoents/reusable/userNavbar";

const PackageDetailPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<UserPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (packageId) {
      fetchPackageDetail();
    }
  }, [packageId]);

  const fetchPackageDetail = async () => {
    try {
      setLoading(true);
      const response = await UserPackageService.getPackageById(packageId!);
      if (response?.success) {
        setPackageData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch package details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg font-light tracking-wide">Loading...</div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <PackageIcon className="w-16 h-16 text-gray-700 mb-4" />
        <h2 className="text-white text-2xl mb-2 font-light tracking-wide">Package Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-white text-black rounded-full font-medium mt-4 hover:bg-gray-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <UserNavbar />
        
        <div className="pt-24 pb-20">
          <div className="max-w-[1600px] mx-auto px-8">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-12">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium tracking-wide">BACK</span>
              </button>
              
              <span className="px-5 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400">
                {typeof packageData.category === 'object'
                  ? packageData.category.name
                  : packageData.category}
              </span>
            </div>

            {/* Main Grid Layout */}
            <div className="grid lg:grid-cols-2 gap-16">
              
              {/* LEFT COLUMN - Content First */}
              <div className="space-y-10 lg:pr-8">
                
                {/* Title Section */}
                <div className="space-y-6">
                  <h1 className="text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
                    {packageData.title}
                  </h1>
                  
                  {/* Creator Info */}
                  {typeof packageData.creatorId === 'object' && (
                    <div className="flex items-center gap-4 pt-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                        {packageData.creatorId.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Creator</div>
                        <div className="font-semibold text-xl">{packageData.creatorId.fullName}</div>
                        {packageData.creatorId.city && (
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{packageData.creatorId.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Package Overview</h2>
                  <p className="text-gray-300 text-lg leading-relaxed font-light">
                    {packageData.description}
                  </p>
                </div>

                {/* Package Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Created</div>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(packageData.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Updated</div>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(packageData.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 col-span-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Total Images</div>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                      <span>{packageData.images?.length || 0} Photos</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 space-y-6">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Package Investment</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold tracking-tight">₹{packageData.price.toLocaleString()}</span>
                      <span className="text-gray-500 font-medium text-lg">/pkg</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-white text-black py-5 rounded-2xl font-bold text-base hover:bg-gray-200 transition-all hover:scale-[1.02] shadow-2xl">
                      Book This Package
                    </button>
                    <button className="w-full bg-zinc-800 text-white py-5 rounded-2xl font-bold text-base hover:bg-zinc-700 transition-all border border-zinc-700">
                      Contact Creator
                    </button>
                  </div>

                  <div className="pt-6 border-t border-zinc-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span>Available for immediate booking</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN - Images */}
              <div className="space-y-4">
                
                {/* Main Image */}
                <div className="relative group">
                  <div className="aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                    {packageData.images?.length > 0 ? (
                      <S3Media
                        s3Key={packageData.images[selectedImage]}
                        alt={packageData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PackageIcon className="w-24 h-24 text-gray-800" />
                      </div>
                    )}
                  </div>
                  
                  {/* Floating View All Button */}
                  {packageData.images?.length > 1 && (
                    <button
                      onClick={() => setShowGallery(true)}
                      className="absolute top-6 right-6 px-6 py-3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-2xl"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>VIEW ALL {packageData.images.length}</span>
                    </button>
                  )}
                </div>

                {/* Thumbnail Grid */}
                {packageData.images?.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {packageData.images.slice(0, 5).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-xl overflow-hidden transition-all border-2 ${
                          selectedImage === index
                            ? "border-white scale-95 opacity-100"
                            : "border-transparent opacity-50 hover:opacity-100 hover:scale-105"
                        }`}
                      >
                        <S3Media
                          s3Key={img}
                          alt={`${packageData.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Image Counter */}
                {packageData.images?.length > 0 && (
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                    <span>IMAGE {selectedImage + 1} OF {packageData.images.length}</span>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen p-8">
            
            {/* Modal Header */}
            <div className="max-w-7xl mx-auto mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">Photo Gallery</h3>
                  <p className="text-sm text-gray-500">{packageData.images?.length || 0} images available</p>
                </div>
                <button
                  onClick={() => setShowGallery(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packageData.images?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setShowGallery(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group relative aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-all border border-zinc-800 hover:border-white"
                  >
                    <S3Media
                      s3Key={img}
                      alt={`${packageData.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageDetailPage;

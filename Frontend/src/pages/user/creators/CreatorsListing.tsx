import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatorService } from "@/services/user/creatorService";
import { CreatorProfileResponse } from "@/interface/creator/creatorProfileInterface";
import Navbar from "@/components/reusable/userNavbar";
import { S3Media } from "@/components/reusable/s3Media";
import { ROUTES } from "@/constants/routes";
import { Search, MapPin, ArrowRight, Camera } from "lucide-react";
import LogoLoading from "@/components/reusable/LogoLoading";
import Pagination from "@/components/reusable/pagination";
import { useDebounce } from "@/hooks/useDebounce";

const CreatorsListing: React.FC = () => {
  const [creators, setCreators] = useState<CreatorProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const response = await CreatorService.listCreators(page, 9, debouncedSearch);
      if (response.success) {
        setCreators(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch creators", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [page, debouncedSearch]);

  const handleCreatorClick = (id: string) => {
    navigate(ROUTES.USER.CREATOR_DETAIL.replace(":id", id));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Camera className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Our Network</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              The <span className="text-gray-500 underline decoration-1 underline-offset-8">Creators</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-lg">
              Connect with world-class professional photographers and videographers ready to bring your vision to life.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-white/20 focus:bg-zinc-900 transition-all font-medium placeholder:text-zinc-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <LogoLoading />
          </div>
        ) : creators.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
              <Search className="w-8 h-8 text-zinc-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">No creators found</h3>
              <p className="text-zinc-500 font-medium">Try adjusting your search criteria</p>
            </div>
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="text-sm font-black uppercase tracking-widest text-white underline underline-offset-4 hover:text-zinc-400 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {creators.map((creator) => (
                <div 
                  key={creator._id}
                  onClick={() => handleCreatorClick(creator._id)}
                  className="group relative bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-700 cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <S3Media
                      s3Key={creator.profilePhoto || ""}
                      alt={creator.fullName}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    
                    {/* Floating Info */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-3 h-3 text-white/60" />
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                          {creator.city || "Location Pending"}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-gray-300 transition-colors">
                        {creator.fullName}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {creator.specialties && creator.specialties.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-zinc-400">
                          {s}
                        </span>
                      ))}
                      {creator.specialties && creator.specialties.length > 2 && (
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-zinc-600">
                          +{creator.specialties.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Experience</p>
                        <p className="text-sm font-bold text-white tracking-widest">{creator.yearsOfExperience}+ Years</p>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                        <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-20">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Aesthetic Footer Decor */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
    </div>
  );
};

export default CreatorsListing;

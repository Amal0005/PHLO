import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { CreatorProfileServices } from "@/services/creator/creatorProfileService";
import { CreatorProfileResponse, EditCreatorProfilePayload } from "@/interface/creator/creatorProfileInterface";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { Edit, Mail, Phone, MapPin, Briefcase, User, Star, Link as LinkIcon, Camera, X } from "lucide-react";
import { toast } from "react-toastify";
import { uploadToS3 } from "@/utils/uploadToS3";
import { S3Media } from "@/compoents/reusable/s3Media";

export default function CreatorProfile() {
  const [profile, setProfile] = useState<CreatorProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditCreatorProfilePayload>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await CreatorProfileServices.getProfile();
      if (response.success) {
        setProfile(response.creator);
        // Initialize edit form with current profile data
        const { fullName, phone, city, yearsOfExperience, bio, portfolioLink, specialties } = response.creator;
        setEditForm({ fullName, phone, city, yearsOfExperience, bio, portfolioLink, specialties });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "yearsOfExperience" ? parseInt(value) || 0 : value,
    }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let profilePhotoUrl = profile?.profilePhoto;

      if (selectedFile) {
        // Corrected S3 upload logic
        profilePhotoUrl = await uploadToS3(selectedFile, "profile");
      }

      const payload = { ...editForm, profilePhoto: profilePhotoUrl };
      const response = await CreatorProfileServices.editProfile(payload);

      if (response.success) {
        setProfile(response.creator);
        setIsEditModalOpen(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorNavbar />

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        {/* Profile Header Card */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-12">
          <div className="h-48 bg-gradient-to-r from-zinc-800 to-zinc-900 relative">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-6 right-6 p-3 bg-white text-black rounded-full hover:scale-105 transition-transform shadow-xl flex items-center gap-2 text-sm font-semibold"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          <div className="px-8 pb-10 -mt-20 relative">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
              <div className="w-40 h-40 rounded-3xl border-4 border-black bg-zinc-800 overflow-hidden shadow-2xl">
                {profile?.profilePhoto ? (
                  <S3Media s3Key={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <User className="w-16 h-16" />
                  </div>
                )}
              </div>

              <div className="flex-1 pb-2">
                <h1 className="text-4xl font-bold mb-2">{profile?.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile?.city}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {profile?.yearsOfExperience} Years Exp</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-semibold">About Me</h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {profile?.bio || "No bio added yet."}
                  </p>
                </section>

                <section>
                  <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-semibold">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile?.specialties && profile.specialties.length > 0 ? (
                      profile.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                          {specialty}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm italic">No specialties listed.</span>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-semibold">Contact Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="text-sm">{profile?.phone}</p>
                      </div>
                    </div>
                    {profile?.portfolioLink && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Portfolio</p>
                          <a href={profile.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white underline decoration-white/20 underline-offset-4">
                            View Work
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
            <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md px-8 py-6 border-b border-white/10 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <p className="text-gray-500 text-sm italic">Update your professional identity</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-8">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl bg-zinc-800 overflow-hidden border-2 border-white/10 group-hover:border-white transition-colors">
                    {photoPreview ? (
                      <img src={photoPreview} className="w-full h-full object-cover" />
                    ) : profile?.profilePhoto ? (
                      <S3Media s3Key={profile.profilePhoto} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-2xl">
                    <Camera className="w-8 h-8 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Click to change profile photo</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName || ""}
                    onChange={handleEditChange}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone || ""}
                    onChange={handleEditChange}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={editForm.city || ""}
                    onChange={handleEditChange}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                    placeholder="Location"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Years of Exp</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={editForm.yearsOfExperience || 0}
                    onChange={handleEditChange}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
                    placeholder="Experience"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio || ""}
                  onChange={handleEditChange}
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white transition-colors h-32 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Portfolio Link</label>
                <div className="flex items-center bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 focus-within:border-white transition-colors">
                  <LinkIcon className="w-4 h-4 text-gray-500 mr-3" />
                  <input
                    type="url"
                    name="portfolioLink"
                    value={editForm.portfolioLink || ""}
                    onChange={handleEditChange}
                    className="bg-transparent outline-none flex-1 text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-semibold hover:text-white transition-colors text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

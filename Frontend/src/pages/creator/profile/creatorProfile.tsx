import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { CreatorProfileServices } from "@/services/creator/creatorProfileService";
import { CreatorProfileResponse, EditCreatorProfilePayload } from "@/interface/creator/creatorProfileInterface";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { Edit, Mail, Phone, MapPin, Briefcase, User, Link as LinkIcon } from "lucide-react";
import { toast } from "react-toastify";
import { S3Service } from "@/services/s3Service";
import { S3Media } from "@/compoents/reusable/s3Media";
import { EditCreatorProfileModal } from "./components/EditCreatorProfileModal";
import { z } from "zod";
import { creatorProfileSchema } from "@/validation/creatorProfileSchema";
import { AxiosError } from "axios";

export default function CreatorProfile() {
  const [profile, setProfile] = useState<CreatorProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditCreatorProfilePayload>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await CreatorProfileServices.getProfile();
      if (response.success && response.creator) {
        const creatorData = response.creator;

        setProfile(creatorData);
        const { fullName, phone, city, yearsOfExperience, bio, portfolioLink, specialties } = creatorData;
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

    setErrors({});

    const validation = creatorProfileSchema.safeParse(editForm);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue: z.ZodIssue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      let profilePhotoKey = profile?.profilePhoto || "";

      if (profilePhotoKey.startsWith("http")) {
        const s3Match = profilePhotoKey.match(/amazonaws\.com\/(.+)$/);
        if (s3Match && s3Match[1]) {
          profilePhotoKey = decodeURIComponent(s3Match[1]);
        }
      }

      if (selectedFile) {
        const { uploadUrl, publicUrl } = await S3Service.getPresignedUrl(selectedFile.type, "profile");
        await S3Service.uploadFile(uploadUrl, selectedFile);
        profilePhotoKey = publicUrl;
      }

      const payload = { ...editForm, profilePhoto: profilePhotoKey };
      const response = await CreatorProfileServices.editProfile(payload);

      if (response.success) {
        setProfile(response.creator);
        setIsEditModalOpen(false);
        toast.success("Profile updated successfully");
      }
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      const serverMessage = axiosError.response?.data?.message || "Failed to update profile";

      if (serverMessage.toLowerCase().includes("mobile") || serverMessage.toLowerCase().includes("phone")) {
        setErrors(prev => ({ ...prev, phone: serverMessage }));
      } else if (serverMessage.toLowerCase().includes("full name")) {
        setErrors(prev => ({ ...prev, fullName: serverMessage }));
      } else {
        toast.error(serverMessage);
      }
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
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-12">
          <div className="h-48 bg-gradient-to-r from-zinc-800 to-zinc-900 relative">
            <button
              onClick={() => {
                setErrors({});
                setIsEditModalOpen(true);
              }}
              className="absolute bottom-6 right-6 z-20 p-3 bg-white text-black rounded-full hover:scale-105 transition-transform shadow-xl flex items-center gap-2 text-sm font-semibold"
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

      <EditCreatorProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editForm={editForm}
        handleEditChange={handleEditChange}
        handlePhotoChange={handlePhotoChange}
        handleSubmit={handleEditSubmit}
        isSaving={isSaving}
        photoPreview={photoPreview}
        profilePhoto={profile?.profilePhoto}
        errors={errors}
      />
    </div>
  );
}

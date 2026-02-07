import { ChangeEvent, FormEvent } from "react";
import { X, Camera, User, Link as LinkIcon } from "lucide-react";
import { S3Media } from "@/compoents/reusable/s3Media";
import { EditCreatorProfilePayload } from "@/interface/creator/creatorProfileInterface";

interface EditCreatorProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    editForm: EditCreatorProfilePayload;
    handleEditChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => void;
    isSaving: boolean;
    photoPreview: string | null;
    profilePhoto?: string;
    errors?: Record<string, string>;
}

export const EditCreatorProfileModal = ({
    isOpen,
    onClose,
    editForm,
    handleEditChange,
    handlePhotoChange,
    handleSubmit,
    isSaving,
    photoPreview,
    profilePhoto,
    errors = {},
}: EditCreatorProfileModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
                <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md px-8 py-6 border-b border-white/10 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-2xl font-bold">Edit Profile</h2>
                        <p className="text-gray-500 text-sm italic">Update your professional identity</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-2xl bg-zinc-800 overflow-hidden border-2 border-white/10 group-hover:border-white transition-colors">
                                {photoPreview ? (
                                    <img src={photoPreview} className="w-full h-full object-cover" />
                                ) : profilePhoto ? (
                                    <S3Media s3Key={profilePhoto} className="w-full h-full object-cover" />
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
                                className={`w-full bg-zinc-800/50 border ${errors.fullName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-white transition-colors`}
                                placeholder="Enter full name"
                            />
                            {errors.fullName && <p className="text-red-500 text-xs ml-1">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={editForm.phone || ""}
                                onChange={handleEditChange}
                                className={`w-full bg-zinc-800/50 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-white transition-colors`}
                                placeholder="Phone number"
                            />
                            {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={editForm.city || ""}
                                onChange={handleEditChange}
                                className={`w-full bg-zinc-800/50 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-white transition-colors`}
                                placeholder="Location"
                            />
                            {errors.city && <p className="text-red-500 text-xs ml-1">{errors.city}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Years of Exp</label>
                            <input
                                type="number"
                                name="yearsOfExperience"
                                value={editForm.yearsOfExperience || 0}
                                onChange={handleEditChange}
                                className={`w-full bg-zinc-800/50 border ${errors.yearsOfExperience ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-white transition-colors`}
                                placeholder="Experience"
                            />
                            {errors.yearsOfExperience && <p className="text-red-500 text-xs ml-1">{errors.yearsOfExperience}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Bio</label>
                        <textarea
                            name="bio"
                            value={editForm.bio || ""}
                            onChange={handleEditChange}
                            className={`w-full bg-zinc-800/50 border ${errors.bio ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 outline-none focus:border-white transition-colors h-32 resize-none`}
                            placeholder="Tell us about yourself..."
                        />
                        {errors.bio && <p className="text-red-500 text-xs ml-1">{errors.bio}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Portfolio Link</label>
                        <div className={`flex items-center bg-zinc-800/50 border ${errors.portfolioLink ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus-within:border-white transition-colors`}>
                            <LinkIcon className="w-4 h-4 text-gray-500 mr-3" />
                            <input
                                type="url"
                                name="portfolioLink"
                                value={editForm.portfolioLink || ""}
                                onChange={handleEditChange}
                                className="bg-transparent outline-none flex-1 text-sm placeholder:text-zinc-600"
                                placeholder="https://..."
                            />
                        </div>
                        {errors.portfolioLink && <p className="text-red-500 text-xs ml-1">{errors.portfolioLink}</p>}
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
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
    );
};

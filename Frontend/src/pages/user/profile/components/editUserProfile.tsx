import { X } from "lucide-react";
import { ChangeEvent, FormEvent } from "react";

interface EditUserProfileProps {
    isOpen: boolean;
    onClose: () => void;
    form: { name: string; phone: string; email: string };
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => void;
    isSaving: boolean;
    errors?: any;
}

export const EditUserProfile = ({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    isSaving,
    errors,
}: EditUserProfileProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Edit Form */}
                <div className="text-center space-y-8">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-tight mb-2">
                            Edit Profile
                        </h2>
                        <p className="text-gray-500 text-sm tracking-wide">
                            Update your information
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Name Field */}
                        <div className="space-y-3">
                            <label className="block text-sm text-gray-500 uppercase tracking-wider">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className={`w-full bg-transparent border-b ${errors?.name ? "border-red-500" : "border-white/20"} text-white text-center text-lg font-light py-3 px-4 outline-none focus:border-white transition-colors placeholder:text-gray-600`}
                            />
                            {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-3">
                            <label className="block text-sm text-gray-500 uppercase tracking-wider">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className={`w-full bg-transparent border-b ${errors?.phone ? "border-red-500" : "border-white/20"} text-white text-center text-lg font-light py-3 px-4 outline-none focus:border-white transition-colors placeholder:text-gray-600`}
                            />
                            {errors?.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
                        </div>
                        <div className="space-y-3">
                            <label className="block text-sm text-gray-500 uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className={`w-full bg-transparent border-b ${errors?.email ? "border-red-500" : "border-white/20"} text-white text-center text-lg font-light py-3 px-4 outline-none focus:border-white transition-colors placeholder:text-gray-600`}
                            />
                            {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                        </div>

                        {/* Save Button */}
                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center justify-center gap-3 text-white text-sm uppercase tracking-wider hover:text-gray-300 transition-colors group mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                                <span className="w-10 h-10 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        "→"
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

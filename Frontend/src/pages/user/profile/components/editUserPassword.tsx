import { X, CameraOff, Camera } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

interface EditUserPasswordProps {
    isOpen: boolean;
    onClose: () => void;
    passwordForm: {
        currentPassword: "";
        newPassword: "";
        confirmPassword: "";
    };
    handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handlePasswordSubmit: (e: FormEvent) => void;
    isSaving: boolean;
    errors?: any;
}

export const EditUserPassword = ({
    isOpen,
    onClose,
    passwordForm,
    handlePasswordChange,
    handlePasswordSubmit,
    isSaving,
    errors,
}: EditUserPasswordProps) => {
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    if (!isOpen) return null;

    const togglePassword = (field: "current" | "new" | "confirm") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

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

                {/* Password Form */}
                <div className="text-center space-y-8">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-tight mb-2">
                            Change Password
                        </h2>
                        <p className="text-gray-500 text-sm tracking-wide">
                            Update your account password
                        </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-8">
                        {/* Current Password */}
                        <div className="space-y-3">
                            <label className="block text-sm text-gray-500 uppercase tracking-wider">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword.current ? "text" : "password"}
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                    className={`w-full bg-transparent border-b ${errors?.currentPassword ? "border-red-500" : "border-white/20"} text-white text-center text-lg font-light py-3 px-4 outline-none focus:border-white transition-colors placeholder:text-gray-600`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword("current")}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2"
                                >
                                    {showPassword.current ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors?.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword[0]}</p>}
                        </div>

                        {/* New Password */}
                        <div className="space-y-3">
                            <label className="block text-sm text-gray-500 uppercase tracking-wider">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    className={`w-full bg-transparent border-b ${errors?.newPassword ? "border-red-500" : "border-white/20"} text-white text-center text-lg font-light py-3 px-4 outline-none focus:border-white transition-colors placeholder:text-gray-600`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword("new")}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2"
                                >
                                    {showPassword.new ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors?.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword[0]}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-3">
                            <label className="block text-sm text-gray-500 uppercase tracking-wider">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    className={`w-full bg-transparent border-b ${errors?.confirmPassword ? "border-red-500" : "border-white/20"} text-white text-center text-lg font-light py-3 px-4 outline-none focus:border-white transition-colors placeholder:text-gray-600`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword("confirm")}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2"
                                >
                                    {showPassword.confirm ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors?.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword[0]}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center justify-center gap-3 text-white text-sm uppercase tracking-wider hover:text-gray-300 transition-colors group mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{isSaving ? "Updating..." : "Update Password"}</span>
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

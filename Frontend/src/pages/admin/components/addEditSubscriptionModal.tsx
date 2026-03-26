import { useState, useEffect } from "react";
import { X, Plus, Trash2, AlertCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Subscription, SubscriptionForm } from "@/interface/admin/subscriptionInterface";
import { subscriptionSchema } from "@/validation/subscriptionSchema";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubscriptionForm) => Promise<void>;
  subscription: Subscription | null;
}

interface FormErrors {
  name?: string;
  price?: string;
  duration?: string;
  features?: string[];
  isActive?: string;
}

export default function AddEditSubscriptionModal({ isOpen, onClose, onSubmit, subscription }: Props) {
  const [formData, setFormData] = useState<SubscriptionForm>({
    name: "",
    price: 0,
    duration: 1,
    features: [""],
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        price: subscription.price,
        duration: subscription.duration,
        features: subscription.features.length > 0 ? subscription.features : [""],
        isActive: subscription.isActive,
      });
    } else {
      setFormData({
        name: "",
        price: 0,
        duration: 1,
        features: [""],
        isActive: true,
      });
    }
    setErrors({});
  }, [subscription, isOpen]);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });

    if (errors.features && errors.features[index]) {
      const newFeatureErrors = [...errors.features];
      newFeatureErrors[index] = "";
      setErrors({ ...errors, features: newFeatureErrors });
    }
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ""] });

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length ? newFeatures : [""] });

    if (errors.features) {
      const newFeatureErrors = errors.features.filter((_, i) => i !== index);
      setErrors({ ...errors, features: newFeatureErrors });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        features: formData.features.map(f => f.trim()).filter(f => f !== ""),
      };
      
      const validatedData = subscriptionSchema.parse(formattedData);
      await onSubmit(validatedData as SubscriptionForm);
      onClose();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          if (path === "features") {
            const index = issue.path[1] as number;
            if (!fieldErrors.features) fieldErrors.features = [];
            if (index !== undefined) {
              fieldErrors.features[index] = issue.message;
            }
          } else {
            const field = path as keyof Omit<FormErrors, 'features'>;
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 40px)' }}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex p-2.5 bg-white/5 border border-white/10 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {subscription ? "Edit Plan" : "New Plan"}
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {subscription ? "Update subscription settings" : "Configure a new membership level"}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form noValidate onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
              <div className="space-y-4">
                {/* Plan Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    className={`w-full bg-zinc-900/50 border ${errors.name ? 'border-red-500/50 focus:ring-red-500/10' : 'border-white/5 focus:ring-white/5'} rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-4 transition-all`}
                    placeholder="e.g. Professional Excellence"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1.5 ml-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => {
                        setFormData({ ...formData, price: Number(e.target.value) });
                        if (errors.price) setErrors({ ...errors, price: "" });
                      }}
                      className={`w-full bg-zinc-900/50 border ${errors.price ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-4 focus:ring-white/5 transition-all`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-[11px] mt-1.5 ml-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                      Duration (Mo)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => {
                        setFormData({ ...formData, duration: Number(e.target.value) });
                        if (errors.duration) setErrors({ ...errors, duration: "" });
                      }}
                      className={`w-full bg-zinc-900/50 border ${errors.duration ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-4 focus:ring-white/5 transition-all`}
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-[11px] mt-1.5 ml-1">
                        {errors.duration}
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Features & Benefits
                    </label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-[10px] font-bold text-white/50 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> ADD FEATURE
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <motion.div layout key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className={`w-full bg-zinc-900/50 border ${errors.features?.[index] ? 'border-red-500/30' : 'border-white/5'} rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-white/5 transition-all text-sm`}
                            placeholder="Identify a plan benefit..."
                          />
                          {errors.features?.[index] && (
                            <p className="text-red-500 text-[10px] mt-1.5 ml-1">
                              {errors.features[index]}
                            </p>
                          )}
                        </div>
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-3.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-red-500/60 hover:text-red-500 transition-all flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group transition-colors hover:bg-white/[0.07]">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">Status</span>
                    <span className="text-[10px] text-gray-500 font-medium">Toggle plan visibility</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="hidden"
                    />
                    <label 
                      htmlFor="isActive" 
                      className={`block w-11 h-6 rounded-full cursor-pointer transition-all border border-white/5 ${
                        formData.isActive ? 'bg-white' : 'bg-zinc-800'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                        formData.isActive ? 'left-6 bg-black' : 'left-1 bg-zinc-500'
                      }`} />
                    </label>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer Buttons */}
            <div className="p-6 bg-zinc-900/40 border-t border-white/5 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-zinc-800 text-gray-300 font-bold hover:bg-zinc-700 transition-all active:scale-[0.98] text-sm"
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="flex-[2] bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  subscription ? "Update Plan" : "Publish Plan"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


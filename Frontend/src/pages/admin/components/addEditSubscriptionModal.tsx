import { useState, useEffect } from "react";
import { X, Plus, Trash2, AlertCircle } from "lucide-react";
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

  if (!isOpen) return null;

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });

    // Clear feature error if it exists
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

    try {
      const validatedData = subscriptionSchema.parse({
        ...formData,
        features: formData.features.map(f => f.trim()),
      });

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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {subscription ? "Edit Subscription" : "Add Subscription"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              className={`w-full bg-black border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:border-white/20 outline-none transition-colors`}
              placeholder="e.g. Premium Plus"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: Number(e.target.value) });
                  setErrors({ ...errors, price: "" });
                }}
                className={`w-full bg-black border ${errors.price ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:border-white/20 outline-none transition-colors`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Duration (Months)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => {
                  setFormData({ ...formData, duration: Number(e.target.value) });
                  setErrors({ ...errors, duration: "" });
                }}
                className={`w-full bg-black border ${errors.duration ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:border-white/20 outline-none transition-colors`}
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.duration}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 flex justify-between items-center">
              Features
              <button
                type="button"
                onClick={addFeature}
                className="text-xs flex items-center gap-1 text-white/60 hover:text-white transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Feature
              </button>
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className={`flex-1 bg-black border ${errors.features && errors.features[index] ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:border-white/20 outline-none transition-colors`}
                      placeholder="Enter feature..."
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {errors.features && errors.features[index] && (
                    <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-2 h-2" /> {errors.features[index]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-white/10 bg-black text-white focus:ring-0 focus:ring-offset-0 accent-white"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-400 cursor-pointer">Active Subscription</label>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] mt-4 shadow-lg shadow-white/5"
          >
            {subscription ? "Update Plan" : "Create Plan"}
          </button>
        </form>
      </div>
    </div>
  );
}

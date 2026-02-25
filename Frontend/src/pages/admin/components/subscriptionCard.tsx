import { Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Subscription } from "@/interface/admin/subscriptionInterface";

interface Props {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionCard({ subscription, onEdit, onDelete }: Props) {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col h-full hover:border-white/20 transition-all relative overflow-hidden group">
      {!subscription.isActive && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-4 py-1 rotate-45 translate-x-3 -translate-y-0 shadow-lg">
          INACTIVE
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{subscription.name}</h3>
          <p className="text-sm text-gray-500 uppercase tracking-wider">Creator Plan</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(subscription)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(subscription.subscriptionId)}
            className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold text-white">₹{subscription.price}</span>
        <span className="text-gray-500 ml-2">/ {subscription.duration} months</span>
      </div>

      <div className="flex-1 space-y-3 mb-6">
        {subscription.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-white/40" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5 mt-auto">
        <p className="text-[10px] text-gray-600">Created: {new Date(subscription.createdAt || "").toLocaleDateString()}</p>
      </div>
    </div>
  );
}

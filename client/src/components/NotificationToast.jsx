import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${
        toast.type === 'success' 
          ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' 
          : toast.type === 'error'
          ? 'bg-red-950/90 border-red-500/50 text-red-200'
          : 'bg-cyan-950/90 border-cyan-500/50 text-cyan-200'
      }`}>
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-cyan-400 shrink-0" />
        )}
        <div className="text-xs font-mono">
          <div className="font-bold text-white">{toast.title}</div>
          <div className="text-[11px] opacity-90">{toast.message}</div>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-black/20"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

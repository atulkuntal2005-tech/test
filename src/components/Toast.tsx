import React from 'react';
import { useSite } from '../context/SiteContext.tsx';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { notification, clearNotification } = useSite();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div className="fixed top-24 right-4 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border ${
          isSuccess
            ? 'bg-slate-900 text-white border-amber-500/40'
            : 'bg-red-900 text-white border-red-700'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 text-sm font-medium leading-snug">
          {notification.message}
        </div>
        <button
          onClick={clearNotification}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

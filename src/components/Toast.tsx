import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: string;
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-[#EAA21D] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#9E1A17] shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-[#1B4D3E] shrink-0" />,
  };

  const borders = {
    info: 'border-l-4 border-l-blue-600',
    warning: 'border-l-4 border-l-[#EAA21D]',
    error: 'border-l-4 border-l-[#9E1A17]',
    success: 'border-l-4 border-l-[#1B4D3E]',
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-[calc(100%-2.5rem)] p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 ${borders[toast.type]} animate-in slide-in-from-bottom duration-300`}
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}
        <div className="flex-1 pr-2">
          {toast.title && (
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              {toast.title}
            </p>
          )}
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5 leading-normal">
            {toast.message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors p-1"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

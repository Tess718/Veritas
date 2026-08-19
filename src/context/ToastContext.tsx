import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', durationMs: number = 4500) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (durationMs > 0) {
      setTimeout(() => {
        removeToast(id);
      }, durationMs);
    }
  }, [removeToast]);

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const warning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          const borderColor = isSuccess
            ? 'border-[#00E575]/40 hover:border-[#00E575]/70'
            : isError
            ? 'border-rose-500/40 hover:border-rose-500/70'
            : isWarning
            ? 'border-[#FFE600]/40 hover:border-[#FFE600]/70'
            : 'border-cyan-500/40 hover:border-cyan-500/70';

          const glowColor = isSuccess
            ? 'bg-[#00E575]/10'
            : isError
            ? 'bg-rose-500/10'
            : isWarning
            ? 'bg-[#FFE600]/10'
            : 'bg-cyan-500/10';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start justify-between p-4 rounded-2xl bg-[#0C0E17]/95 border ${borderColor} backdrop-blur-2xl shadow-2xl shadow-black/80 transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in group relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${glowColor} rounded-full blur-xl pointer-events-none`} />

              <div className="flex items-start space-x-3 relative z-10">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#00E575] shrink-0 mt-0.5" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-[#FFE600] shrink-0 mt-0.5" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}

                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 block">
                    {toast.type}
                  </span>
                  <p className="text-xs font-sans text-white leading-relaxed pr-2">
                    {toast.message}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 relative z-10"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

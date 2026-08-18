import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { FiCheckCircle, FiInfo, FiX, FiXCircle } from 'react-icons/fi';

const ToastContext = createContext(null);

const icons = {
  success: FiCheckCircle,
  error: FiXCircle,
  info: FiInfo
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || FiInfo;
          return (
            <div
              key={toast.id}
              className="animate-slide-in flex items-start gap-3 rounded-lg border border-ink-200/80 bg-white/90 p-4 shadow-soft backdrop-blur-md dark:border-ink-700/80 dark:bg-ink-900/85"
            >
              <Icon className={toast.type === 'error' ? 'mt-0.5 text-red-600 dark:text-red-400' : 'mt-0.5 text-brand-600 dark:text-brand-400'} />
              <p className="min-w-0 flex-1 text-sm font-medium text-ink-700 dark:text-ink-200">{toast.message}</p>
              <button
                className="text-ink-400 hover:text-ink-700 dark:text-ink-500 dark:hover:text-white"
                onClick={() => removeToast(toast.id)}
                aria-label="Close toast"
              >
                <FiX />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

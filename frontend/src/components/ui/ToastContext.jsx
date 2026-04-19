import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  const TYPE_STYLES = {
    success: 'bg-green-500/20  border-green-500/40  text-green-300',
    error:   'bg-red-500/20    border-red-500/40    text-red-300',
    warning: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
    info:    'bg-blue-500/20   border-blue-500/40   text-blue-300',
  };

  const ICONS = {
    success: '✓', error: '✕', warning: '!', info: 'i',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => onRemove(toast.id)}
          className={`fade-in flex items-start gap-3 px-4 py-3 rounded-2xl border backdrop-blur-sm
            pointer-events-auto cursor-pointer ${TYPE_STYLES[toast.type] || TYPE_STYLES.info}`}
        >
          <span className="font-bold text-sm flex-shrink-0 w-5 h-5 rounded-full border border-current
            flex items-center justify-center text-xs">
            {ICONS[toast.type] || 'i'}
          </span>
          <p className="text-sm leading-snug flex-1">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
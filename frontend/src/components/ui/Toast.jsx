import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

const ICONS = {
  success: <CheckCircle size={18} />,
  error:   <AlertCircle size={18} />,
  info:    <Info size={18} />,
  warning: <AlertCircle size={18} />,
};

export const Toast = ({ toast, onRemove }) => (
  <div className={`toast toast-${toast.type} animate-slide-in`} role="alert">
    <span className="toast-icon">{ICONS[toast.type] || ICONS.info}</span>
    <span className="toast-message">{toast.message}</span>
    <button className="toast-close" onClick={() => onRemove(toast.id)} aria-label="Dismiss">
      <X size={14} />
    </button>
  </div>
);

export const ToastContainer = ({ toasts, onRemove }) => (
  <div className="toast-container" aria-live="polite" aria-atomic="false">
    {toasts.map(t => (
      <Toast key={t.id} toast={t} onRemove={onRemove} />
    ))}
  </div>
);

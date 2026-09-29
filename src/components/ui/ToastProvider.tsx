"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Check, Heart, X } from "lucide-react";

type ToastKind = "success" | "favorite";
type ToastItem = { id: number; message: string; kind: ToastKind };
type ToastContextValue = { showToast: (message: string, kind?: ToastKind) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function dismissToast(id: number) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function showToast(message: string, kind: ToastKind = "success") {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-2), { id, message, kind }]);
    window.setTimeout(() => dismissToast(id), 3500);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4 sm:bottom-6"
        role="status"
      >
        {toasts.map((toast) => (
          <div
            className="pointer-events-auto flex min-h-12 w-full max-w-sm items-center gap-3 rounded-[var(--radius-button)] bg-ink px-4 py-3 text-sm font-medium text-surface shadow-[var(--shadow-popover)]"
            key={toast.id}
          >
            {toast.kind === "favorite" ? (
              <Heart aria-hidden="true" className="shrink-0 text-primary" size={18} />
            ) : (
              <Check aria-hidden="true" className="shrink-0 text-surface" size={18} />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              aria-label="Fermer la notification"
              className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-pill)] text-surface/75 hover:bg-surface/10 hover:text-surface"
              onClick={() => dismissToast(toast.id)}
              type="button"
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within ToastProvider");
  return value;
}
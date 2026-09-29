"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/55 p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            animate={{ opacity: 1, y: 0, scale: 1 }}
            aria-labelledby="modal-title"
            aria-modal="true"
            className="relative w-full max-w-lg rounded-[var(--radius-card)] bg-surface p-6 shadow-[var(--shadow-popover)] sm:p-8"
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            role="dialog"
          >
            <button
              aria-label="Fermer la fenêtre"
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-[var(--radius-pill)] hover:bg-bg"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" size={20} />
            </button>
            <h2 className="pr-10 font-heading font-bold" id="modal-title">
              {title}
            </h2>
            <div className="mt-5">{children}</div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
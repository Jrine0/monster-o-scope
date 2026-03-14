import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FormModal({ open, title, onClose, children }: FormModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          onClick={onClose}
          aria-hidden="true"
        >
          <motion.div
            className="
              mx-4 w-full max-w-120
              rounded-radius-lg border border-border-subtle
              bg-bg-surface p-6
              shadow-xl
            "
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2
                id="form-modal-title"
                className="text-heading-2 text-text-primary"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="
                  -mr-1 flex h-8 w-8 cursor-pointer items-center
                  justify-center rounded-radius-sm
                  text-text-muted transition-colors duration-150
                  hover:bg-bg-elevated hover:text-text-secondary
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
                "
                aria-label="Close dialog"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Body (form content via children) */}
            <div className="mt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

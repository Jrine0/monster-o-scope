import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  variant?: "danger" | "default";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  variant = "default",
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          onClick={onCancel}
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
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
          >
            {/* Icon + Title */}
            <div className="flex items-start gap-3">
              {isDanger && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-radius-md bg-error-muted">
                  <AlertTriangle
                    size={20}
                    className="text-error"
                    aria-hidden="true"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2
                  id="confirm-dialog-title"
                  className="text-heading-2 text-text-primary"
                >
                  {title}
                </h2>
                <p
                  id="confirm-dialog-message"
                  className="text-body-md mt-2 text-text-secondary"
                >
                  {message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border-subtle pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="
                  text-body-md cursor-pointer rounded-radius-sm
                  border border-border-default bg-transparent
                  px-4 py-2 font-semibold text-text-secondary
                  transition-colors duration-150
                  hover:bg-bg-elevated
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
                "
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`
                  text-body-md cursor-pointer rounded-radius-sm
                  border border-transparent px-4 py-2 font-semibold
                  transition-colors duration-150
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  ${
                    isDanger
                      ? "bg-error text-white hover:bg-error/90 focus-visible:outline-error"
                      : "bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
                  }
                `}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

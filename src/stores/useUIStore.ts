import { create } from "zustand";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ActiveModal {
  type: string;
  data?: unknown;
}

interface UIState {
  /* Toast notifications */
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;

  /* Modal state */
  activeModal: ActiveModal | null;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let toastCounter = 0;

function generateToastId(): string {
  toastCounter += 1;
  return `toast-${Date.now()}-${toastCounter}`;
}

/* ------------------------------------------------------------------ */
/*  Store — NO persist middleware                                      */
/* ------------------------------------------------------------------ */

export const useUIStore = create<UIState>()((set) => ({
  /* ── Toasts ── */
  toasts: [],

  addToast: (message, type = "info") => {
    const id = generateToastId();
    const toast: Toast = { id, message, type };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3_000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  /* ── Modal ── */
  activeModal: null,

  openModal: (type, data) => set({ activeModal: { type, data } }),

  closeModal: () => set({ activeModal: null }),
}));

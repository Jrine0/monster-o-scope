import { create } from "zustand";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type UserRole = "admin" | "teacher" | "student";

export interface AuthUser {
  id: string;
  email: string | null;
  student_id: string | null;
  name: string;
  role: UserRole;
  school_id: string;
  school_name: string;
}

export interface SchoolContext {
  school_id: string;
  school_name: string;
}

interface AuthState {
  /* Session data — lives in JS memory ONLY (no persist middleware) */
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;

  /* Actions */
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
  setHydrating: (v: boolean) => void;
  getSchoolContext: () => SchoolContext | null;
}

/* ------------------------------------------------------------------ */
/*  Store — NO persist middleware (access token must stay in memory)   */
/* ------------------------------------------------------------------ */

export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isHydrating: true,

  setSession: (token, user) =>
    set({ accessToken: token, user, isAuthenticated: true }),

  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),

  setHydrating: (v) => set({ isHydrating: v }),

  getSchoolContext: () => {
    const { user } = get();
    if (!user) return null;
    return { school_id: user.school_id, school_name: user.school_name };
  },
}));

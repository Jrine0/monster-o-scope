import { create } from "zustand";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type UserRole = "admin" | "teacher" | "student";

export interface AuthUser extends SchoolContext {
  id: string;
  email: string | null;
  student_id: string | null;
  name: string;
  role: UserRole;
}

export interface SchoolContext {
  school_id: string;
  school_name: string;
}

interface AuthState {
  /* Session data — lives in JS memory ONLY (no persist middleware) */
  accessToken: string | null;
  user: AuthUser | null;
  school: SchoolContext | null;
  isAuthenticated: boolean;
  isHydrating: boolean;

  /* Actions */
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setAccessToken: (token: string) => void;
  setHydrating: (v: boolean) => void;
  getSchoolContext: () => SchoolContext | null;
}

/* ------------------------------------------------------------------ */
/*  Store — NO persist middleware (access token must stay in memory)   */
/* ------------------------------------------------------------------ */

export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  user: null,
  school: null,
  isAuthenticated: false,
  isHydrating: true,

  setUser: (user) =>
    set({ user, isAuthenticated: true }),

  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),

  setAccessToken: (token) => set({ accessToken: token }),

  setHydrating: (v) => set({ isHydrating: v }),

  getSchoolContext: () => {
    const { user } = get();
    if (!user) return null;
    return { school_id: user.school_id, school_name: user.school_name };
  },
}));

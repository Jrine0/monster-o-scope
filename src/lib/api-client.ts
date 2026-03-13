import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

/** Backend error envelope: { error: { code, message, details? } } */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Wrapper so consumers can check `error.response?.data` */
export class ApiRequestError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(code: string, message: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/* ------------------------------------------------------------------ */
/* Single Axios instance — the only HTTP client used in the app      */
/* ------------------------------------------------------------------ */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://vyasa-api.zoodleme.in";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // sends httpOnly refresh cookie automatically
});

/* ------------------------------------------------------------------ */
/* Request interceptor — attach Bearer token                         */
/* ------------------------------------------------------------------ */

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ------------------------------------------------------------------ */
/* Response interceptor — unwrap envelope, normalise errors,         */
/* handle 401 → refresh → retry                                     */
/* ------------------------------------------------------------------ */

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token);
    else p.reject(error);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  /* ── Success: unwrap { data: {...} } envelope ── */
  (response) => {
    if (response.data && typeof response.data === "object" && "data" in response.data) {
      response.data = response.data.data;
    }
    return response;
  },

  /* ── Error handler ── */
  async (error: AxiosError<{ error?: ApiError }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    /* --- Normalise error from backend envelope --- */
    const backendError = error.response?.data?.error;
    if (backendError) {
      const apiErr = new ApiRequestError(
        backendError.code,
        backendError.message,
        error.response?.status ?? 500,
        backendError.details,
      );
      // Attach to the Axios error for downstream catch blocks
      (error as AxiosError & { apiError: ApiRequestError }).apiError = apiErr;
    }

    /* --- 401 → Refresh → Retry flow --- */
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        /* Another refresh is already in-flight — queue this request */
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        /* POST /auth/refresh — cookie is sent automatically */
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken: string = data.data?.access_token ?? data.access_token;
        useAuthStore.getState().setSession(newToken, data.data?.user ?? data.user);

        processQueue(null, newToken);

        /* Retry the original request with the new token */
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearSession();
        /* Redirect to login using TanStack Router or window location */
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
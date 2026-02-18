import { store } from "@/store/store";
import api from "./axiosConfig";
import axios from "axios";
import { toast } from "react-toastify";
import { removeUser, setToken } from "@/store/slices/auth/authSlice";

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


const getRoleFromUrl = (url: string): "admin" | "creator" | "user" => {
  if (url.startsWith("/admin") || url.includes("/admin/")) return "admin";
  if (url.startsWith("/creator") || url.includes("/creator/")) return "creator";
  return "user";
};

/**
 * Helper to perform a forced logout based on the role.
 */
const forceLogout = () => {
  store.dispatch(removeUser())
};

export const setUpInterceptors = () => {
  api.interceptors.request.use((config) => {
    const state = store.getState();
    const url = config.url || "";

    if (url.startsWith("http")) return config;
    if (config.headers?.Authorization) return config;

    const token = state.auth.token;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
      const status = err.response?.status;
      const url = err.config?.url || "";
      const message = err.response?.data?.message;

      const isLoginRequest = url.endsWith("/login") || url.includes("/login?");
      const isRefreshRequest = url.includes("/refresh-token");

      // Don't intercept login or refresh requests
      if (isLoginRequest || isRefreshRequest) {
        return Promise.reject(err);
      }

      const role = getRoleFromUrl(url);

      // Handle 401 Unauthorized (Token Expiration)
      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: resolve as (value?: unknown) => void,
              reject: reject as (reason?: unknown) => void,
            });
          })
            .then((token) => {
              originalRequest._retry = true;
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Using a single refresh token endpoint for all roles
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/refresh-token`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = response.data;

          store.dispatch(setToken(accessToken));

          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          forceLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle 403 Forbidden (Blocked/Restricted)
      if (status === 403) {
        toast.info(message || "Your account has been restricted.");
        forceLogout();
      }

      return Promise.reject(err);
    }
  );
};
import { store } from "@/store/store";
import api from "./axiosConfig";
import axios from "axios";
import { clearCreatorAuth, setCreatorAuth } from "@/store/slices/creator/creatorAuthSlice";
import { clearUserAuth, setUserAuth } from "@/store/slices/user/userAuthSlice";
import { clearAdminAuth, setAdminAuth } from "@/store/slices/admin/adminAuthSlice";
import { clearUser } from "@/store/slices/user/userSlice";
import { clearCreator } from "@/store/slices/creator/creatorSlice";
import { clearAdmin } from "@/store/slices/admin/adminSlice";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setUpInterceptors = () => {
  api.interceptors.request.use((config) => {
    const state = store.getState();
    const url = config.url || "";

    if (url.startsWith("http")) return config;
    if (config.headers?.Authorization) return config;

    let token: string | null = null;

    if (url.startsWith("/admin") || url.includes("/admin/")) {
      token = state.adminAuth.adminToken;
    } else if (url.startsWith("/creator") || url.includes("/creator/")) {
      token = state.creatorAuth.creatorToken;
    } else {
      token = state.userAuth.userToken;
    }

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
      const message = err.response?.data?.message || "Your account has been restricted.";

      const isLoginRequest = url.endsWith("/login") || url.includes("/login?");
      const isRefreshRequest = url.includes("/refresh-token");

      if (isLoginRequest || isRefreshRequest) {
        return Promise.reject(err);
      }

      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          let refreshUrl = "/refresh-token";
          if (url.includes("/admin")) {
            refreshUrl = "/admin/refresh-token";
          } else if (url.includes("/creator")) {
            refreshUrl = "/creator/refresh-token";
          }

          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}${refreshUrl}`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = response.data;

          if (url.includes("/admin")) {
            store.dispatch(setAdminAuth(accessToken));
          } else if (url.includes("/creator")) {
            store.dispatch(setCreatorAuth(accessToken));
          } else {
            store.dispatch(setUserAuth(accessToken));
          }

          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          if (url.includes("/admin")) {
            store.dispatch(clearAdminAuth());
            store.dispatch(clearAdmin());
            window.location.href = "/admin/login";
          } else if (url.includes("/creator")) {
            store.dispatch(clearCreatorAuth());
            store.dispatch(clearCreator());
            window.location.href = "/creator/login";
          } else {
            store.dispatch(clearUserAuth());
            store.dispatch(clearUser());
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 403) {
        alert(message);
        if (url.includes("/admin")) {
          store.dispatch(clearAdminAuth());
          store.dispatch(clearAdmin());
          window.location.href = "/admin/login";
        } else if (url.includes("/creator")) {
          store.dispatch(clearCreatorAuth());
          store.dispatch(clearCreator());
          window.location.href = "/creator/login";
        } else {
          store.dispatch(clearUserAuth());
          store.dispatch(clearUser());
          window.location.href = "/login";
        }
      }

      return Promise.reject(err);
    }
  );
};

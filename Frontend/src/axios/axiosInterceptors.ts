import { store } from "@/store/store";
import api from "./axiosConfig";
import { clearCreatorAuth } from "@/store/creator/creatorAuthSlice";
import { clearUserAuth } from "@/store/user/userAuthSlice";
import { clearAdminAuth } from "@/store/admin/adminAuthSlice";

export const setUpInterceptors = () => {
  api.interceptors.request.use((config) => {
    const state = store.getState();
    const url = config.url || "";

    if (config.headers?.Authorization) return config;

    let token: string | null = null;

    if (url.includes("/admin")) {
      token = state.adminAuth.adminToken;
    } else if (url.includes("/creator")) {
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
    (err) => {
      if (err.response?.status === 401) {
        const url = err.config?.url || "";

        if (url.includes("/admin")) {
          store.dispatch(clearAdminAuth());
          window.location.href = "/admin/login";
        } else if (url.includes("/creator")) {
          store.dispatch(clearCreatorAuth());
          window.location.href = "/creator/login";
        } else if (!url.includes("/admin") && !url.includes("/creator")) {
          store.dispatch(clearUserAuth());
          window.location.href = "/login";
        }
      }

      return Promise.reject(err);
    },
  );
};

import { store } from "@/store/store";
import api from "./axiosConfig";
import { clearCreatorAuth } from "@/store/slices/creator/creatorAuthSlice";
import { clearUserAuth } from "@/store/slices/user/userAuthSlice";
import { clearAdminAuth } from "@/store/slices/admin/adminAuthSlice";
import { clearUser } from "@/store/slices/user/userSlice";
import { clearCreator } from "@/store/slices/creator/creatorSlice";
import { clearAdmin } from "@/store/slices/admin/adminSlice";

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
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";
    const message =
      err.response?.data?.message || "Your account has been restricted.";

    const isLoginRequest =
      url.endsWith("/login") || url.includes("/login?");

    if (isLoginRequest) {
      return Promise.reject(err);
    }

    if (status === 401) {
      if (url.includes("/admin")) {
        store.dispatch(clearAdminAuth());
        store.dispatch(clearAdmin());
        window.location.href = "/admin/login";
      } else if (url.includes("/creator")) {
        store.dispatch(clearCreatorAuth());
        store.dispatch(clearCreator());
        window.location.href = "/creator/login";
      } else {
        const currentPath = window.location.pathname;
        if (
          !currentPath.startsWith("/creator") &&
          !currentPath.startsWith("/admin")
        ) {
          store.dispatch(clearUserAuth());
          store.dispatch(clearUser());
          window.location.href = "/login";
        }
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

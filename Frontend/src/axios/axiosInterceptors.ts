import { store } from "@/store/store";
import api from "./axiosConfig";
import { clearCreatorAuth } from "@/store/slices/creator/creatorAuthSlice";
import { clearUserAuth } from "@/store/slices/user/userAuthSlice";
import { clearAdminAuth } from "@/store/slices/admin/adminAuthSlice";
import { clearUser } from "@/store/slices/user/userSlice";

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

          const currentPath = window.location.pathname;
          if (!currentPath.startsWith("/creator") && !currentPath.startsWith("/admin")) {
            store.dispatch(clearUserAuth());
            window.location.href = "/login";
          }
        }
      }

if (err.response?.status === 403) {
  const url = err.config?.url || "";

  if (url.includes("/creator/login")) {
    return Promise.reject(err);
  }

  alert(err.response.data.message || "Your account has been blocked.");

  store.dispatch(clearUserAuth());
  store.dispatch(clearUser());

  window.location.href = "/login";
}


      return Promise.reject(err);
    },
  );
};

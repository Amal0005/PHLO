import { store } from "@/store/store";
import api from "./axiosConfig";
import { clearAuth } from "@/store/tokenSlice";

export const setUpInterceptors = () => {
  api.interceptors.request.use((config) => {
    const { token } = store.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err.response?.status;
      if (status === 401) {
        const role = store.getState().token.role;
        store.dispatch(clearAuth());

        if (role === "admin") {
          window.location.href = "/admin/login";
        } else if (role === "creator") {
          window.location.href = "/creator/login";
        } else {
          window.location.href = "/login";
        }
      }

      return Promise.reject(err);
    },
  );
};

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "@/store/store";
import { removeUser } from "@/store/slices/auth/authSlice";
import { clearCreator } from "@/store/slices/creator/creatorSlice";
import { clearAdmin } from "@/store/slices/admin/adminSlice";
import { clearUser } from "@/store/slices/user/userSlice";
import api from "@/axios/axiosConfig";

export default function AuthInitializer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state: RootState) => state.auth.token);
  const role = useSelector((state: RootState) => state.auth.role);

  const isRehydrated = useSelector(
    (state: RootState) => state._persist?.rehydrated
  );

  const handleCreatorLogout = useCallback(() => {
    dispatch(removeUser());
    dispatch(clearCreator());
    navigate("/creator/login", { replace: true });
  }, [dispatch, navigate]);

  const handleAdminLogout = useCallback(() => {
    dispatch(removeUser());
    dispatch(clearAdmin());
    navigate("/admin/login", { replace: true });
  }, [dispatch, navigate]);

  const handleUserLogout = useCallback(() => {
    dispatch(removeUser());
    dispatch(clearUser());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!isRehydrated) return;

    const publicPaths = [
      "/login",
      "/register",
      "/forgot-password",
      "/verify-otp",
    ];

    if (
      publicPaths.includes(location.pathname) ||
      location.pathname.startsWith("/creator/login") ||
      location.pathname.startsWith("/admin/login")
    ) {
      return;
    }

    const path = location.pathname;
    if (path.startsWith("/creator") && role === "creator" && token) {
      api.get("/creator/me").catch(handleCreatorLogout);
    } else if (path.startsWith("/admin") && role === "admin" && token) {
      api.get("/admin/me").catch(handleAdminLogout);
    } else if (!path.startsWith("/creator") && !path.startsWith("/admin") && role === "user" && token) {
      api.get("/profile").catch(handleUserLogout);
    }


  }, [isRehydrated, location.pathname, token, role, handleCreatorLogout, handleAdminLogout, handleUserLogout]);

  return null;
}

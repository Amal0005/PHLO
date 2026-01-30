import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "@/store/store";
import { clearCreatorAuth } from "@/store/slices/creator/creatorAuthSlice";
import { clearAdminAuth } from "@/store/slices/admin/adminAuthSlice";
import { clearUserAuth } from "@/store/slices/user/userAuthSlice";
import { clearUser } from "@/store/slices/user/userSlice";
import api from "@/axios/axiosConfig";

export default function AuthInitializer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const creatorToken = useSelector(
    (state: RootState) => state.creatorAuth.creatorToken
  );
  const adminToken = useSelector(
    (state: RootState) => state.adminAuth.adminToken
  );
  const userToken = useSelector(
    (state: RootState) => state.userAuth.userToken
  );

  const isRehydrated = useSelector(
    (state: RootState) => state._persist?.rehydrated
  );

  const handleCreatorLogout = () => {
    dispatch(clearCreatorAuth());
    navigate("/creator/login", { replace: true });
  };

  const handleAdminLogout = () => {
    dispatch(clearAdminAuth());
    navigate("/admin/login", { replace: true });
  };

  const handleUserLogout = () => {
    dispatch(clearUserAuth());
    dispatch(clearUser());
    navigate("/login", { replace: true });
  };

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
    if (path.startsWith("/creator") && creatorToken) {
      api.get("/creator/me").catch(handleCreatorLogout);
    } else if (path.startsWith("/admin") && adminToken) {
      api.get("/admin/me").catch(handleAdminLogout);
    } else if (!path.startsWith("/creator") && !path.startsWith("/admin") && userToken) {
      api.get("/me").catch(handleUserLogout);
    }


  }, [isRehydrated, location.pathname]);

  return null;
}

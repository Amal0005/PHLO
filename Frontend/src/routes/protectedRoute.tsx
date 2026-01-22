import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Role } from "@/store/tokenSlice";

export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: Role[];
}) {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.token
  );

  if (!isAuthenticated) {
    if (allowedRoles.includes("admin")) {
      return <Navigate to="/admin/login" replace />;
    }

    if (allowedRoles.includes("creator")) {
      return <Navigate to="/creator/login" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (role === "creator") {
      return <Navigate to="/creator/dashboard" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  // Authorized
  return <Outlet />;
}

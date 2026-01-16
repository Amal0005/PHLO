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
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

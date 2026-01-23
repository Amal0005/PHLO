import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Role } from "@/store/tokenSlice";

const loginRoute: Record<Role, string> = {
  user: "/login",
  creator: "/creator/login",
  admin: "/admin/login",
};

const dashboardRoute: Record<Role, string> = {
  user: "/home",
  creator: "/creator/dashboard",
  admin: "/admin/dashboard",
};

export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: Role[];
}) {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.token
  );

  if (!isAuthenticated) {
    const targetRole = allowedRoles[0];
    return <Navigate to={loginRoute[targetRole]} replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={dashboardRoute[role!]} replace />;
  }

  return <Outlet />;
}

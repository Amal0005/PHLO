import { selectAuthByRole } from "@/store/selectors/authSelector";
import { RootState } from "@/store/store";
import { Role } from "@/types/role";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

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

type Props = {
  role: Role;
  requireAuth?: boolean;
};

export default function ProtectedRoute({
  role,
  requireAuth = true,
}: Props) {
  const auth = useSelector((state: RootState) =>
    selectAuthByRole(state, role)
  );

  const isAuthenticated = auth?.isAuthenticated;

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={loginRoute[role]} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={dashboardRoute[role]} replace />;
  }

  return <Outlet />;
}

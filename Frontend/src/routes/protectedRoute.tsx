import { selectAuthByRole } from "@/store/selectors/authSelector";
import { RootState } from "@/store/store";
import { Role } from "@/types/role";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

const loginRoute: Record<Role, string> = {
  user: ROUTES.USER.LOGIN,
  creator: ROUTES.CREATOR.LOGIN,
  admin: ROUTES.ADMIN.LOGIN,
};

const dashboardRoute: Record<Role, string> = {
  user: ROUTES.USER.HOME,
  creator: ROUTES.CREATOR.DASHBOARD,
  admin: ROUTES.ADMIN.DASHBOARD,
};

type Props = {
  role: Role;
  requireAuth?: boolean;
};

export default function ProtectedRoute({ role, requireAuth = true }: Props) {
  const auth = useSelector((state: RootState) => selectAuthByRole(state, role));

  const isAuthenticated = auth?.isAuthenticated;

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={loginRoute[role]} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={dashboardRoute[role]} replace />;
  }

  return <Outlet />;
}

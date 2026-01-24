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

export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: Role[];
}) {
  const role = allowedRoles[0];

  const auth = useSelector((state: RootState) =>
    selectAuthByRole(state, role)
  );

  const isAuthenticated = auth?.isAuthenticated;

  if (!isAuthenticated) {
    return <Navigate to={loginRoute[role]} replace />;
  }

  return <Outlet />;
}

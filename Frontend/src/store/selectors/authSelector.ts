import { RootState } from "@/store/store";
import { Role } from "@/types/role";

export const selectAuthByRole = (state: RootState, role: Role) => {
  switch (role) {
    case "user":
      return state.userAuth;
    case "creator":
      return state.creatorAuth;
    case "admin":
      return state.adminAuth;
    default:
      return undefined;
  }
};

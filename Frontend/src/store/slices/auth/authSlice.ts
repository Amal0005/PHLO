import { Role } from "@/types/role";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthSliceType {
  token: null | string;
  role: null | Role;
}
const initialState: AuthSliceType = {
  role: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload
    },
    removeUser(state) {
      state.token = null;
      state.role = null;
    }
  }
});

export const { setToken, setRole, removeUser } = authSlice.actions;
export default authSlice.reducer;


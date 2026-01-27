import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AdminAuthState = {
  adminToken: string | null;
  isAuthenticated: boolean;
};

const initialState: AdminAuthState = {
  adminToken: null,
  isAuthenticated: false,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminAuth: (state, action: PayloadAction<string>) => {
      state.adminToken = action.payload;
      state.isAuthenticated = true;
    },
    clearAdminAuth: (state) => {
      state.adminToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAdminAuth, clearAdminAuth } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

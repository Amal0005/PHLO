import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "user" | "creator" | "admin";

type TokenState = {
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
};

const initialState: TokenState = {
  token: null,
  role: null,
  isAuthenticated: false,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; role: Role }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },

    clearAuth: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },

    hydrateAuth: (
      state,
      action: PayloadAction<{ token: string; role: Role }>,
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
  },
});

export const { setAuth, clearAuth, hydrateAuth } = tokenSlice.actions;

export default tokenSlice.reducer;

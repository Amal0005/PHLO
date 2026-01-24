import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Admin = {
  id: string;
  name: string;
  email: string;
};

type AdminState = {
  admin: Admin | null;
};

const initialState: AdminState = {
  admin: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload;
    },
    clearAdmin: (state) => {
      state.admin = null;
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;

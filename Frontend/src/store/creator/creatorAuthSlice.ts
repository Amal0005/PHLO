import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CreatorAuthState = {
  creatorToken: string | null;
  isAuthenticated: boolean;
};

const initialState: CreatorAuthState = {
  creatorToken: null,
  isAuthenticated: false,
};

const creatorAuthSlice = createSlice({
  name: "creatorAuth",
  initialState,
  reducers: {
    setCreatorAuth: (state, action: PayloadAction<string>) => {
      state.creatorToken = action.payload;
      state.isAuthenticated = true;
    },
    clearCreatorAuth: (state) => {
      state.creatorToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCreatorAuth, clearCreatorAuth } =
  creatorAuthSlice.actions;
export default creatorAuthSlice.reducer;

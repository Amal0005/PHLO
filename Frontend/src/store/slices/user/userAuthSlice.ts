import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserAuthState = {
  userToken: string | null;
  isAuthenticated: boolean;
};

const initialState: UserAuthState = {
  userToken: null,
  isAuthenticated: false,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserAuth: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload;
      state.isAuthenticated = true;
    },
    clearUserAuth: (state) => {
      state.userToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserAuth, clearUserAuth } = userAuthSlice.actions;
export default userAuthSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Creator = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  city?: string;
  status: "pending" | "approved" | "rejected";
  specialties?: string[];
};

type CreatorState = {
  creator: Creator | null;
};

const initialState: CreatorState = {
  creator: null,
};

export const creatorSlice = createSlice({
  name: "creator",
  initialState,
  reducers: {
    setCreator: (state, action: PayloadAction<Creator>) => {
      state.creator = action.payload;
    },

    clearCreator: (state) => {
      state.creator = null;
    },

    updateCreatorProfile: (
      state,
      action: PayloadAction<Partial<Creator>>
    ) => {
      if (state.creator) {
        state.creator = { ...state.creator, ...action.payload };
      }
    },
  },
});

export const {
  setCreator,
  clearCreator,
  updateCreatorProfile,
} = creatorSlice.actions;

export default creatorSlice.reducer;

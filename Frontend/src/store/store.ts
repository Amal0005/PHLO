import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/auth/authSlice";
import userReducer from "./slices/user/userSlice";
import creatorReducer from "./slices/creator/creatorSlice";
import adminReducer from "./slices/admin/adminSlice";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,

  creator: creatorReducer,

  admin: adminReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "user",
    "auth",
    "creator",
    "admin",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

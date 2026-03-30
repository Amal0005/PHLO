import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/store/slices/auth/authSlice";
import userReducer from "@/store/slices/user/userSlice";
import creatorReducer from "@/store/slices/creator/creatorSlice";
import adminReducer from "@/store/slices/admin/adminSlice";
import notificationReducer from "@/store/slices/notification/notificationSlice";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,

  creator: creatorReducer,

  admin: adminReducer,
  notifications: notificationReducer,
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

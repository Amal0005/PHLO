import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/user/userSlice";
import userAuthReducer from "./slices/user/userAuthSlice";
import creatorReducer from "./slices/creator/creatorSlice";
import creatorAuthReducer from "./slices/creator/creatorAuthSlice";
import adminReducer from "./slices/admin/adminSlice";
import adminAuthReducer from "./slices/admin/adminAuthSlice";

const rootReducer = combineReducers({
  user: userReducer,
  userAuth: userAuthReducer,

  creator: creatorReducer,
  creatorAuth: creatorAuthReducer,

  admin: adminReducer,
  adminAuth: adminAuthReducer,
});

const persistConfig = {
  key: "root",
  storage,
whitelist: [
  "user",
  "userAuth",
  "creator",
  "creatorAuth",
  "admin",
  "adminAuth",
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

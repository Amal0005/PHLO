import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./user/userSlice";
import creatorReducer from "./creator/creatorSlice";
import tokenReducer from "./tokenSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  creator: creatorReducer,
  token: tokenReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "creator", "token"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

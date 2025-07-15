import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// step 1 : Configure Redux Persist
const persistConfig = {
  key: "auth-app",
  storage,
};
// step 2 : combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

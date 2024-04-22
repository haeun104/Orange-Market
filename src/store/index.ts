import { configureStore } from "@reduxjs/toolkit";
import favoriteSlice from "./favorite-slice";
import requestSlice from "./request-slice";

const store = configureStore({
  reducer: {
    favorite: favoriteSlice.reducer,
    request: requestSlice.reducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

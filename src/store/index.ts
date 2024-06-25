import { configureStore } from "@reduxjs/toolkit";
import requestSlice from "./request-slice";
import cartSlice from "./cart-slice";

const store = configureStore({
  reducer: {
    request: requestSlice.reducer,
    cart: cartSlice.reducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

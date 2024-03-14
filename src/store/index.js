import { configureStore } from "@reduxjs/toolkit";
import favoriteSlice from "./favorite-slice";
import requestSlice from "./request-slice";

const store = configureStore({
  reducer: { favorite: favoriteSlice.reducer, request: requestSlice.reducer },
});

export default store;

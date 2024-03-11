import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: { favoriteItem: [] },
  reducers: {
    updateFavorites(state, action) {},
  },
});

export const favoriteActions = favoriteSlice.actions;

export default favoriteSlice;

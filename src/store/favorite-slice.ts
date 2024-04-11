import { createSlice } from "@reduxjs/toolkit";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { AppDispatch } from ".";

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: { favoriteItem: [] },
  reducers: {
    updateFavorites(state, action) {
      state.favoriteItem = action.payload;
    },
  },
});

export const favoriteActions = favoriteSlice.actions;

export const fetchFavoriteData = (id: string) => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const favoriteQuery = query(
        collection(db, "favorite"),
        where("userId", "==", id)
      );
      const favoriteSnapshot = await getDocs(favoriteQuery);
      const favoriteList = favoriteSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return favoriteList;
    };
    try {
      const favoriteList = await fetchData();
      dispatch(favoriteActions.updateFavorites(favoriteList));
    } catch (error) {
      console.log(error);
    }
  };
};

export default favoriteSlice;

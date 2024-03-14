import { createSlice } from "@reduxjs/toolkit";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

const requestSlice = createSlice({
  name: "request",
  initialState: { sellingRequest: [], purchaseRequest: []},
  reducers: {
    createSellingList(state, action) {
      state.sellingRequest = action.payload;
    },
    createPurchaseList(state, action) {
      state.purchaseRequest = action.payload;
    },
  },
});

export const requestActions = requestSlice.actions;

export const fetchRequestData = (id) => {
  if (id) {
    return async (dispatch) => {
      const fetchData = async (key) => {
        const requestQuery = query(
          collection(db, "purchase request"),
          where(key, "==", id)
        );
        const requestSnapshot = await getDocs(requestQuery);
        const requestList = requestSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        return requestList;
      };
      try {
        const sellingRequests = await fetchData("seller");
        const purchaseRequest = await fetchData("requestor");
        dispatch(requestActions.createSellingList(sellingRequests));
        dispatch(requestActions.createPurchaseList(purchaseRequest));
      } catch (error) {
        console.log(error);
      }
    };
  }
};

export default requestSlice;

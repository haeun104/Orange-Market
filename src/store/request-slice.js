import { createSlice } from "@reduxjs/toolkit";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

const requestSlice = createSlice({
  name: "request",
  initialState: {
    sellingRequest: [],
    purchaseRequest: [],
    closedSellingRequest: [],
    closedPurchaseRequest: [],
  },
  reducers: {
    createSellingList(state, action) {
      state.sellingRequest = action.payload;
    },
    createPurchaseList(state, action) {
      state.purchaseRequest = action.payload;
    },
    updateClosedSellingList(state, action) {
      state.closedSellingRequest = action.payload;
    },
    updateClosedPurchaseRequest(state, action) {
      state.closedPurchaseRequest = action.payload;
    },
  },
});

export const requestActions = requestSlice.actions;

const fetchData = async (key, id, boolean) => {
  const requestQuery = query(
    collection(db, "purchase request"),
    where(key, "==", id),
    where("isClosed", "==", boolean)
  );
  const requestSnapshot = await getDocs(requestQuery);
  const requestList = requestSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return requestList;
};

export const fetchRequestData = (id, key) => {
  if (id) {
    return async (dispatch) => {
      if (key === "seller") {
        try {
          const sellingRequests = await fetchData("seller", id, false);
          dispatch(requestActions.createSellingList(sellingRequests));
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const purchaseRequest = await fetchData("requestor", id, false);
          dispatch(requestActions.createPurchaseList(purchaseRequest));
        } catch (error) {
          console.log(error);
        }
      }
    };
  }
};

export default requestSlice;

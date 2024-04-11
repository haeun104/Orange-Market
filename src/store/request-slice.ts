import { createSlice } from "@reduxjs/toolkit";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { AppDispatch } from ".";

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

const fetchData = async (key: string, id: string, boolean: boolean) => {
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

export const fetchRequestData = (id: string, key: string) => {
  if (!id) return;

  return async (dispatch: AppDispatch) => {
    let data, actionCreator;
    try {
      if (key === "seller") {
        data = await fetchData("seller", id, false);
        actionCreator = requestActions.createSellingList;
      } else if (key === "requestor") {
        data = await fetchData("requestor", id, false);
        actionCreator = requestActions.createPurchaseList;
      } else if (key === "sellerClosed") {
        data = await fetchData("seller", id, true);
        actionCreator = requestActions.updateClosedSellingList;
      } else {
        data = await fetchData("requestor", id, true);
        actionCreator = requestActions.updateClosedPurchaseRequest;
      }

      dispatch(actionCreator(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export default requestSlice;

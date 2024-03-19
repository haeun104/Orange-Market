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
  // if (id) {
  //   return async (dispatch) => {
  //     if (key === "seller") {
  //       try {
  //         const sellingRequests = await fetchData("seller", id, false);
  //         dispatch(requestActions.createSellingList(sellingRequests));
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else if (key === "requestor") {
  //       try {
  //         const purchaseRequest = await fetchData("requestor", id, false);
  //         dispatch(requestActions.createPurchaseList(purchaseRequest));
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else if (key === "sellerClosed") {
  //       try {
  //         const sellingRequests = await fetchData("seller", id, true);
  //         dispatch(requestActions.updateClosedSellingList(sellingRequests));
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else {
  //       try {
  //         const purchaseRequest = await fetchData("requestor", id, true);
  //         dispatch(requestActions.updateClosedPurchaseRequest(purchaseRequest));
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };
  // }

  if (!id) return;

  return async (dispatch) => {
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

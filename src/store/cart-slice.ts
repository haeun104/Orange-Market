import { createSlice } from "@reduxjs/toolkit";

export interface CartItems {
  closeDate: string;
  date: string;
  imgURL: string;
  status: string;
  isClosed: boolean;
  price: string;
  product: string;
  requestor: string;
  requestorName: string;
  seller: string;
  sellerName: string;
  title: string;
}

interface CartState {
  cartItems: CartItems[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { product } = action.payload;
      const isExistingItem = state.cartItems.find(
        (item) => item.product === product
      );
      if (!isExistingItem) {
        state.cartItems.push(action.payload);
      }
    },
    removeItem(state, action) {
      const id = action.payload;
      const updatedList = state.cartItems.filter((item) => item.product !== id);
      state.cartItems = updatedList;
    },
    resetCart(state) {
      state.cartItems = [];
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;

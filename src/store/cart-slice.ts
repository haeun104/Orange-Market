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

const storedCartItems = localStorage.getItem("cart");

const initialState: CartState = {
  cartItems: storedCartItems !== null ? JSON.parse(storedCartItems) : [],
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
        const itemsToSave =
          state.cartItems.length === 0
            ? [action.payload]
            : [...state.cartItems, action.payload];
        localStorage.setItem("cart", JSON.stringify(itemsToSave));
        state.cartItems.push(action.payload);
      }
    },
    removeItem(state, action) {
      const id = action.payload;
      const updatedList = state.cartItems.filter((item) => item.product !== id);
      state.cartItems = updatedList;
      localStorage.setItem("cart", JSON.stringify(updatedList));
    },
    resetCart(state) {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;

import { createSlice } from "@reduxjs/toolkit";

export interface CartItems {
  id: string;
  title: string;
  price: string;
  imgURL: string;
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
      const { id } = action.payload;
      const isExistingItem = state.cartItems.find((item) => item.id === id);
      if (!isExistingItem) {
        state.cartItems.push(action.payload);
      }
    },
    removeItem(state, action) {
      const id = action.payload;
      const updatedList = state.cartItems.filter((item) => item.id !== id);
      state.cartItems = updatedList;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;

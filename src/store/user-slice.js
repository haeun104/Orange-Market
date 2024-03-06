import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  //   id: "",
  //   nickname: "",
  //   email: "",
  //   firstname: "",
  //   surname: "",
  //   city: "",
  //   district: "",
  //   street: "",
  //   postalCode: 0,
  //   phone: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    fetchCurrentUserData(state, action) {},
  },
});

export const userActions = userSlice.actions;

export default userSlice;

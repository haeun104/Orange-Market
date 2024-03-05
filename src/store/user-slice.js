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
    fetchCurrentUserData(state, action) {
      //   state.id = action.payload.id;
      // const {
      //   id,
      //   nickname,
      //   email,
      //   firstname,
      //   surname,
      //   city,
      //   district,
      //   street,
      //   postalCode,
      //   phone,
      // } = action.payload;
      //   state.id = id;
      //   state.nickname = nickname;
      //   state.email = email;
      //   state.firstname = firstname;
      //   state.surname = surname;
      //   state.city = city;
      //   state.district = district;
      //   state.street = street;
      //   state.postalCode = postalCode;
      //   state.phone = phone;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;

import Home from "./pages/Home";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Nav from "./components/Home/Nav";
import React, { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../src/firebase-config";
import { auth } from "../src/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import MyProfile from "./pages/MyProfile";
import MyMarket from "./pages/MyMarket";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";

export const DataContext = React.createContext();
export const DispatchContext = React.createContext();

// const initialUserData = {
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
// };

function App() {
  const [usersList, setUsersList] = useState([]);
  const [loggedInUserData, setLoggedInUserData] = useState({});
  const [loggedInUser, setLoggedInUser] = useState({});

  // Real-time synchronization of Firestore data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "user"), (snapshot) => {
      const userList: (string | number)[] = [];
      snapshot.forEach((doc) => {
        userList.push({ ...doc.data(), id: doc.id });
      });
      setUsersList(userList);
    });
    return () => unsubscribe();
  }, []);

  //Update user data whenever login status is changed
  onAuthStateChanged(auth, (currentUser) => {
    setLoggedInUser(currentUser);
  });

  useEffect(() => {
    const getCurrentUserData = (email: string) => {
      const user = usersList.find((user) => user.email === email);
      return user;
    };
    if (loggedInUser !== null) {
      setLoggedInUserData(() => getCurrentUserData(loggedInUser.email));
    }
  }, [loggedInUser, usersList]);

  return (
    <>
      <BrowserRouter>
        <DataContext.Provider
          value={{
            usersList,
            loggedInUser,
            loggedInUserData,
          }}
        >
          <Nav />
          <Outlet />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<AddProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/mymarket" element={<MyMarket />} />
          </Routes>
        </DataContext.Provider>
      </BrowserRouter>
    </>
  );
}
export default App;

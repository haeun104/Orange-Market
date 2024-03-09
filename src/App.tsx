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
import ProductDetail from "./components/Products/ProductDetail";
import ProductsBySeller from "./components/Products/ProductsBySeller";

export const DataContext = React.createContext();

type UserType = {
  nickname: string;
  email: string;
  firstname: string;
  surname: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  phone: string;
};

export interface ProductType {
  title: string;
  description: string;
  price: number;
  category: string;
  date: string;
  clickCount: number;
  likeCount: number;
  seller: string;
  buyer: string;
  isSold: boolean;
  imgURL: string;
  city: string;
  district: string;
}

function App() {
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [loggedInUserData, setLoggedInUserData] = useState({});
  const [loggedInUser, setLoggedInUser] = useState({});
  const [productsList, setProductList] = useState<ProductType[]>([]);

  // Real-time synchronization of Firestore data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "user"), (snapshot) => {
      const userList: UserType[] = [];
      snapshot.forEach((doc) => {
        userList.push({ ...doc.data(), id: doc.id });
      });
      setUsersList(userList);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "product"), (snapshot) => {
      const productList: ProductType[] = [];
      snapshot.forEach((doc) => {
        productList.push({ ...doc.data(), id: doc.id });
      });
      setProductList(productList);
    });
    return () => unsubscribe();
  }, []);

  // Update user data whenever login status is changed
  onAuthStateChanged(auth, (currentUser) => {
    setLoggedInUser(currentUser);
  });

  // Find a user currently logged in
  useEffect(() => {
    const getCurrentUserData = (email: string) => {
      const user = usersList.find((user) => user.email === email);
      return user;
    };
    if (loggedInUser !== null) {
      setLoggedInUserData(() => getCurrentUserData(loggedInUser.email));
    } else {
      setLoggedInUserData({});
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
            productsList,
          }}
        >
          <Nav />
          <Outlet />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<AddProduct />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route
              path="/products/seller/:seller"
              element={<ProductsBySeller />}
            />
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

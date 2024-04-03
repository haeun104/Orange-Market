import Home from "./pages/Home";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Nav from "./components/home/Nav";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../src/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import MyProfile from "./pages/MyProfile";
import MyMarket from "./pages/MyMarket";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./components/products/ProductDetail";
import ProductsBySeller from "./pages/ProductsBySeller";
import MyFavorite from "./pages/MyFavorite";
import PurchaseHistory from "./pages/PurchaseHistory";
import SalesHistory from "./pages/SalesHistory";
import PurchaseRequest from "./pages/PurchaseRequest";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";

export const DataContext = React.createContext();

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

interface UserType {
  id: string;
  email: string;
  nickname: string;
  firstname: string;
  city: string;
  district: string;
  phone: string;
  postalCode: string;
  street: string;
  surname: string;
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>();
  const [currentUser, setCurrentUser] = useState<UserType | undefined>();

  // Update user data whenever login status is changed
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setLoggedInUser(currentUser.email);
    } else {
      setLoggedInUser(null);
    }
  });

  // Fetch user data from DB
  useEffect(() => {
    const fetchUserDataFromDB = async (email: string) => {
      try {
        const userQuery = query(
          collection(db, "user"),
          where("email", "==", email)
        );
        const userSnapshot = await getDocs(userQuery);
        const userList = userSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const user: UserType = userList[0];
        setCurrentUser(user);
      } catch (error) {
        console.log(error);
      }
    };
    if (loggedInUser !== undefined) {
      if (typeof loggedInUser === "string") {
        fetchUserDataFromDB(loggedInUser);
      }
    }
  }, [loggedInUser]);

  return (
    <>
      <BrowserRouter>
        <DataContext.Provider
          value={{
            loggedInUser,
            currentUser,
          }}
        >
          <Nav />
          <Outlet />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<AddProduct />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route
              path="/products/seller/:seller"
              element={<ProductsBySeller />}
            />
            <Route path="/products/edit/:productId" element={<EditProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-market" element={<MyMarket />} />
            <Route path="/my-favorite" element={<MyFavorite />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/purchase-history" element={<PurchaseHistory />} />
            <Route path="/purchase-request" element={<PurchaseRequest />} />
            <Route path="/sales-history" element={<SalesHistory />} />
          </Routes>
        </DataContext.Provider>
      </BrowserRouter>
    </>
  );
}
export default App;

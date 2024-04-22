import Home from "./pages/Home";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase/firebase-config";
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
import { UserType } from "./types/index";
import { fetchUserData } from "./firebase/firebase-action";
import Nav from "./components/Nav";
import ChatWithSeller from "./pages/ChatWithSeller";
import MyChat from "./pages/MyChat";

export const DataContext = React.createContext<UserType | undefined>(undefined);

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>();
  const [currentUser, setCurrentUser] = useState<UserType | undefined>();

  // Update user data whenever login status is changed
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setLoggedInUser(currentUser.email);
    } else {
      setLoggedInUser(null);
      setCurrentUser(undefined);
    }
  });

  // Fetch user data from DB
  useEffect(() => {
    async function fetchData() {
      try {
        if (loggedInUser !== undefined && typeof loggedInUser === "string") {
          const currentUserData = await fetchUserData(loggedInUser);
          setCurrentUser(currentUserData as UserType);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [loggedInUser]);

  return (
    <>
      <BrowserRouter>
        <DataContext.Provider value={currentUser}>
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
            <Route path="/chat/:seller" element={<ChatWithSeller />} />
            <Route path="/my-chat" element={<MyChat />} />
          </Routes>
        </DataContext.Provider>
      </BrowserRouter>
    </>
  );
}
export default App;

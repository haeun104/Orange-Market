import Home from "./pages/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import React, { ReactNode, useContext, useEffect, useState } from "react";
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
import ChatRoom from "./pages/ChatRoom";
import MyChat from "./pages/MyChat";
import NotFound from "./components/NotFount";
import MainLayout from "./layouts/mainLayout/MainLayout";

export const DataContext = React.createContext<UserType | null>(null);

function PrivateRoute({ children }: { children: ReactNode }) {
  const currentUser = useContext(DataContext);
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  async function fetchData(email: string) {
    try {
      const currentUserData = await fetchUserData(email);
      setCurrentUser(currentUserData as UserType);
    } catch (error) {
      console.error(error);
    }
  }

  // Update user data whenever login status is changed
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email !== null) {
        fetchData(user.email);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <BrowserRouter>
        <DataContext.Provider value={currentUser}>
          <Routes>
            <Route path="" element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/products/new"
                element={
                  <PrivateRoute>
                    <AddProduct />
                  </PrivateRoute>
                }
              />
              <Route path="/products/:productId" element={<ProductDetail />} />
              <Route
                path="/products/seller/:seller"
                element={<ProductsBySeller />}
              />
              <Route
                path="/products/edit/:productId"
                element={<EditProduct />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/my-profile"
                element={
                  <PrivateRoute>
                    <MyProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-market"
                element={
                  <PrivateRoute>
                    <MyMarket />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-favorite"
                element={
                  <PrivateRoute>
                    <MyFavorite />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-products"
                element={
                  <PrivateRoute>
                    <MyProducts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/purchase-history"
                element={
                  <PrivateRoute>
                    <PurchaseHistory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/purchase-request"
                element={
                  <PrivateRoute>
                    <PurchaseRequest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sales-history"
                element={
                  <PrivateRoute>
                    <SalesHistory />
                  </PrivateRoute>
                }
              />
              <Route path="/chat/:partner" element={<ChatRoom />} />
              <Route
                path="/my-chat"
                element={
                  <PrivateRoute>
                    <MyChat />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />}></Route>
            </Route>
          </Routes>
        </DataContext.Provider>
      </BrowserRouter>
    </>
  );
}
export default App;

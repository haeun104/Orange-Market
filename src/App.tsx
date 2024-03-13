import Home from "./pages/Home";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Nav from "./components/Home/Nav";
import React, { useEffect, useState } from "react";
import { onSnapshot, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../src/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import MyProfile from "./pages/MyProfile";
import MyMarket from "./pages/MyMarket";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./components/Products/ProductDetail";
import ProductsBySeller from "./components/Products/ProductsBySeller";
import MyFavorite from "./pages/MyFavorite";
import PurchaseHistory from "./pages/PurchaseHistory";
import SalesHistory from "./pages/SalesHistory";
import PurchaseRequest from "./pages/PurchaseRequest";

export const DataContext = React.createContext();

type UserType = {
  [key: string]: string;
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
  const [usersList, setUsersList] = useState([]);
  const [currentUserFavorite, setCurrentUserFavorite] = useState([]);
  const [currentUserRequest, setCurrentUserRequest] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [productsList, setProductList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  // Update user data whenever login status is changed
  onAuthStateChanged(auth, (currentUser) => {
    setLoggedInUser(currentUser);
  });

  // Update a user currently logged in
  useEffect(() => {
    if (loggedInUser !== null) {
      const user = usersList.find((user) => user.email === loggedInUser.email);
      setCurrentUser(user);
    } else {
      setCurrentUser({});
    }
  }, [loggedInUser, usersList]);

  // Real-time synchronization of firebase data
  useEffect(() => {
    const fetchDataFromDb = (collectionName, state) => {
      const unsubscribe = onSnapshot(
        collection(db, collectionName),
        (snapshot) => {
          const dataList = [];
          snapshot.forEach((doc) => {
            dataList.push({ ...doc.data(), id: doc.id });
          });
          state(dataList);
        }
      );
      return () => unsubscribe();
    };
    fetchDataFromDb("user", setUsersList);
    fetchDataFromDb("product", setProductList);
  }, []);

  // Fetch user's market data from DB
  useEffect(() => {
    if (currentUser) {
      fetchMarketData(currentUser.id);
    }
  }, [currentUser, currentUserFavorite, currentUserRequest]);

  async function fetchMarketData(id) {
    try {
      const requestSnapshot = await getDocs(collection(db, "purchase request"));
      const requestList = requestSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const currentUserRequests = requestList.filter(
        (item) => item.requestor === id || item.seller === id
      );
      setCurrentUserRequest(currentUserRequests);

      const favoriteSnapshot = await getDocs(collection(db, "favorite"));
      const favoriteList = favoriteSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const currentUserFavorites = favoriteList.filter(
        (item) => item.userId === id
      );
      setCurrentUserFavorite(currentUserFavorites);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <BrowserRouter>
        <DataContext.Provider
          value={{
            usersList,
            loggedInUser,
            productsList,
            currentUserFavorite,
            currentUserRequest,
            currentUser,
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
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-market" element={<MyMarket />} />
            <Route path="/my-favorite" element={<MyFavorite />} />
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

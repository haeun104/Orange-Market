import Home from "./pages/Home";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";
import Nav from "./components/Home/Nav";
import React, { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../src/firebase-config";

export const DataContext = React.createContext();

function App() {
  const [usersList, setUsersList] = useState([]);

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

  return (
    <>
      <BrowserRouter>
        <DataContext.Provider value={{ usersList }}>
          <Nav />
          <Outlet />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/user/profile/:id" element={<UserProfile />} />
          </Routes>
        </DataContext.Provider>
      </BrowserRouter>
    </>
  );
}
export default App;

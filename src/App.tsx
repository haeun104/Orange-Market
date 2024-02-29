import Nav from "./components/Home/Nav";
import Home from "./pages/Home";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Outlet />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;

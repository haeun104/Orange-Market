import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../src/firebase-config";
import Modal from "../components/Modal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);

  //Login
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      // console.log(user);
      console.log("successfully logged in");
      setOpenModal(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Execute login
  const handleLogin = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <section className="bg-[#EEEEEE] h-calc-vh-minus-64">
      <div className="input-section max-w-[350px] h-[400px] mx-auto flex flex-col justify-center space-y-4 bg-white px-[20px]">
        <h2 className="title">Login</h2>
        <form
          action="/"
          className="flex flex-col space-y-2"
          onSubmit={handleLogin}
        >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="basic-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="basic-input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-gray-400 text-sm py-2">
            <div className="text-main-orange hover:font-bold">
              Forgot password?
            </div>
            <div>
              Not a member?
              <span className="text-blue-600 font-bold hover:text-blue-500">
                <Link to="/signup"> Sign up now!</Link>
              </span>
            </div>
          </div>
          <button className="btn-orange">Login</button>
        </form>
      </div>
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        message={"successfully logged in!"}
      />
    </section>
  );
};

export default Login;

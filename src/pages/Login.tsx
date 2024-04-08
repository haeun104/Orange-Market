import { signInWithEmailAndPassword } from "firebase/auth";
import { FormEvent, MouseEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../src/firebase-config";
import Modal from "../components/Modal";
import Button from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  //Login
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("successfully logged in");
      setOpenModal(true);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  // Execute login
  const handleLogin = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    login();
  };

  // Go back to main page
  const handleCancelClick = () => {
    navigate("/");
  };

  return (
    <>
      <section className="bg-[#EEEEEE] h-calc-vh-minus-64 flex justify-center">
        <div className="input-section w-[350px] h-[400px] my-auto flex flex-col justify-center space-y-4 bg-white px-[20px] rounded-[15px]">
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
            <Button title="Login" btnColor="orange" onClick={handleLogin} />
            <Button
              title="Cancel"
              btnColor="grey"
              onClick={handleCancelClick}
            />
          </form>
        </div>
      </section>
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        message={"successfully logged in!"}
      />
    </>
  );
};

export default Login;

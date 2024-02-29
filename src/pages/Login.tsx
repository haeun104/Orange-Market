import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../src/firebase-config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login= async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="input-section max-w-[300px] h-screen mx-auto flex flex-col align-middle justify-center space-y-4">
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
  );
};

export default Login;

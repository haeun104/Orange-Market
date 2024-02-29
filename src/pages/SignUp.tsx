import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/firebase-config";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setErrorMsg(error.message);
    }
  };

  const handleSignUp = (e) => {
    setErrorMsg("");
    e.preventDefault();
    if (password !== passwordConfirm) {
      setErrorMsg("Passwords are not matched!");
      return;
    }
    registerUser();
  };

  return (
    <div className="input-section max-w-[300px] h-screen mx-auto flex flex-col align-middle space-y-4">
      <h2 className="title">Sign Up</h2>
      <form
        action="/"
        className="flex flex-col space-y-2 pb-5"
        onSubmit={handleSignUp}
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="basic-input"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="password1">Password</label>
        <input
          type="password"
          id="password1"
          className="basic-input"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <label htmlFor="password2">Confirm Password</label>
        <input
          type="password"
          id="password2"
          className="basic-input"
          onChange={(e) => setPasswordConfirm(e.target.value)}
          value={passwordConfirm}
        />
        {errorMsg && (
          <div>
            <p className="text-red-400">{errorMsg}</p>
          </div>
        )}
        <button className="btn-orange">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;

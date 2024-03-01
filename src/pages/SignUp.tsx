import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/firebase-config";
import { useNavigate } from "react-router-dom";

class User {
  nickname;
  email;
  firstname;
  surname;
  city;
  district;
  street;
  phone;
  postalCode;
  constructor(nickname: string, email: string) {
    this.nickname = nickname;
    this.email = email;
    this.firstname = "";
    this.surname = "";
    this.city = "";
    this.district = "";
    this.street = "";
    this.postalCode = 0;
    this.phone = 0;
  }
}

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.message);
      setErrorMsg(error.message);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (password !== passwordConfirm) {
      setErrorMsg("Passwords are not matched!");
      return;
    }
    registerUser();
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  return (
    <div className="input-section max-w-[300px] h-screen mx-auto flex flex-col align-middle space-y-4">
      <h2 className="title">Sign Up</h2>
      <form
        action="/"
        className="flex flex-col space-y-2 pb-5"
        onSubmit={handleSignUp}
      >
        <label htmlFor="nicknamel">Nickname</label>
        <input
          type="text"
          id="nickname"
          className="basic-input"
          onChange={(e) => setNickName(e.target.value)}
          value={nickname}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="basic-input"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <label htmlFor="password1">Password</label>
        <input
          type="password"
          id="password1"
          className="basic-input"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <label htmlFor="password2">Confirm Password</label>
        <input
          type="password"
          id="password2"
          className="basic-input"
          onChange={(e) => setPasswordConfirm(e.target.value)}
          value={passwordConfirm}
          required
        />
        {errorMsg && (
          <div>
            <p className="text-red-400">{errorMsg}</p>
          </div>
        )}
        <div className="flex pt-3 justify-between space-x-4">
          <button className="btn-purple flex-1">Sign Up</button>
          <button
            type="button"
            className="btn-orange flex-1"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

import { useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, createUserInDb } from "../../src/firebase-config";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { DataContext } from "../App";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const { usersList } = useContext(DataContext);

  // Create a new user in DB
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

  // Check validation of passwords and nickname and execute user creation in DB
  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const existingNickname = usersList.find(
      (user) => user.nickname === nickname
    );
    if (password !== passwordConfirm) {
      setErrorMsg("Passwords are not matched!");
      return;
    }
    if (existingNickname) {
      setErrorMsg("The nickname already exists. Please enter another one.");
      return;
    }
    registerUser();
    const newUser = {
      nickname: nickname,
      email: email,
      firstname: "",
      surname: "",
      city: "",
      district: "",
      street: "",
      postalCode: 0,
      phone: 0,
    };
    createUserInDb(newUser);
    setOpenModal(true);
  };

  // Go back to Home page
  const handleCancelClick = () => {
    navigate("/");
  };

  return (
    <>
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
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        message={"Successfully signed up!"}
      />
    </>
  );
};

export default SignUp;

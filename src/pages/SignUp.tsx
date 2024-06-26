import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import Modal from "../components/modals/Modal";
import { collection, getDocs, query, where } from "firebase/firestore";
import Button from "../components/Button";
import { createUserInDb } from "../firebase/firebase-action";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  // Create a new user in DB
  const registerUser = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      const newUser = {
        nickname: nickname,
        email: email,
        firstname: "",
        surname: "",
        city: "",
        district: "",
        street: "",
        postalCode: "",
        phone: "",
      };
      createUserInDb(newUser);
      setOpenModal(true);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        setErrorMsg(error.message);
      }
    }
  };

  const checkExistingNickname = async (nickname: string) => {
    try {
      const nicknameQuery = query(
        collection(db, "user"),
        where("nickname", "==", nickname)
      );
      const nicknameSnapshot = await getDocs(nicknameQuery);
      const nicknameData = nicknameSnapshot.docs.length;
      if (nicknameData !== 0) {
        setErrorMsg("The nickname already exists. Please enter another one.");
        return;
      } else {
        registerUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check validation of passwords and nickname and execute user creation in DB
  const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    if (password !== passwordConfirm) {
      setErrorMsg("Passwords are not matched!");
      return;
    }
    checkExistingNickname(nickname);
  };

  // Go back to Home page
  const handleCancelClick = () => {
    navigate("/");
  };

  return (
    <>
      <section className="bg-[#EEEEEE] h-calc-vh-minus-64 flex justify-center py-[20px]">
        <div className="w-[350px] my-auto flex flex-col justify-center space-y-4 bg-white px-[20px] rounded-[15px]">
          <h2 className="title mt-[15px]">Sign Up</h2>
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
              <Button title="Sign Up" btnColor="purple" />
              <Button
                title="Cancel"
                btnColor="grey"
                onClick={handleCancelClick}
              />
            </div>
          </form>
        </div>
      </section>
      <Modal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        message="Successfully signed up!"
        type="goToHome"
      />
    </>
  );
};

export default SignUp;

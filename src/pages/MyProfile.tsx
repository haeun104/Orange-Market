import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { DataContext } from "../App";
import Modal from "../components/Modal";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { updateDoc, collection, doc } from "firebase/firestore";
import Input from "../components/inputs/Input";
import Button from "../components/Button";

interface UpdatedUser {
  id: string;
  email: string;
  nickname: string;
  firstname: string;
  city: string;
  district: string;
  phone: string;
  postalCode: string;
  street: string;
  surname: string;
}

const MyProfile = () => {
  const [editClicked, setEditClicked] = useState(false);
  const { currentUser } = useContext(DataContext);
  const [updatedUserData, setUpdatedUserData] = useState<
    UpdatedUser | undefined
  >();
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setUpdatedUserData(currentUser);
    }
  }, [currentUser]);

  // Switch to edit mode
  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditClicked(true);
  };

  // Update state of user data
  const handleOnChangeUserData = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedUserData(
      (prev) =>
        ({
          ...prev,
          [e.target.name]: e.target.value,
        } as UpdatedUser)
    );
  };

  // Update user data changes in DB
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async function updateUserProfile(userData: UpdatedUser) {
    try {
      const docRef = doc(collection(db, "user"), userData.id);
      await updateDoc(docRef, userData as { [x: string]: any });
      setOpenModal(true);
      console.log("successfully updated user data.");
    } catch (error) {
      console.error(error);
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Send update commend to DB
  const handleSubmitUserData = () => {
    if (updatedUserData) {
      updateUserProfile(updatedUserData);
    }
  };

  // Go back to a previous page
  const handleCancelClick = (type: string) => {
    if (type === "edit") {
      navigate(-1);
    } else {
      setEditClicked(false);
    }
  };

  if (!currentUser || !updatedUserData) {
    return (
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    );
  } else {
    return (
      <>
        <div className="max-w-[300px] md:max-w-[600px] h-calc-vh-minus-64 mx-auto flex flex-col">
          <h2 className="uppercase text-lg font-bold text-center text-main-orange my-[40px]">
            my profile
          </h2>
          <form className="flex flex-col gap-4 md:flex-row md:gap-10">
            <div className="flex flex-col gap-2 md:flex-1">
              <Input
                id="email"
                value={updatedUserData.email}
                disabled
                label="Email"
              />
              <Input
                id="nickname"
                value={updatedUserData.nickname}
                disabled
                label="Nickname"
              />
              <Input
                id="firstname"
                value={updatedUserData.firstname}
                disabled={editClicked ? false : true}
                onChange={(e) => handleOnChangeUserData(e)}
                label="First Name"
              />
              <Input
                id="surname"
                value={updatedUserData.surname}
                disabled={editClicked ? false : true}
                label="Last Name"
                onChange={(e) => handleOnChangeUserData(e)}
              />
              <Input
                type="phone"
                id="phone"
                value={updatedUserData.phone}
                disabled={editClicked ? false : true}
                label="Mobile"
                onChange={(e) => handleOnChangeUserData(e)}
              />
            </div>
            <div className="flex flex-col gap-2 md:flex-1">
              <Input
                id="city"
                value={updatedUserData.city}
                disabled={editClicked ? false : true}
                onChange={(e) => handleOnChangeUserData(e)}
                label="City"
              />
              <Input
                id="district"
                value={updatedUserData.district}
                disabled={editClicked ? false : true}
                onChange={(e) => handleOnChangeUserData(e)}
                label="District"
              />
              <Input
                id="street"
                value={updatedUserData.street}
                disabled={editClicked ? false : true}
                onChange={(e) => handleOnChangeUserData(e)}
                label="Street"
              />
              <Input
                id="postalCode"
                value={updatedUserData.postalCode}
                disabled={editClicked ? false : true}
                onChange={(e) => handleOnChangeUserData(e)}
                label="Postal Code"
              />
            </div>
          </form>
          <div className="flex flex-row justify-between gap-2 py-[40px] md:gap-10">
            {!editClicked ? (
              <>
                <Button
                  title="Edit"
                  onClick={handleEditClick}
                  btnColor="purple"
                />
                <Button
                  title="Cancel"
                  onClick={() => handleCancelClick("edit")}
                  btnColor="orange"
                />
              </>
            ) : (
              <>
                <Button
                  title="Save"
                  btnColor="purple"
                  onClick={handleSubmitUserData}
                />
                <Button
                  title="Cancel"
                  btnColor="orange"
                  onClick={() => handleCancelClick("submit")}
                />
              </>
            )}
          </div>
        </div>
        <Modal
          openModal={openModal}
          setOpenModal={setOpenModal}
          message={"successfully updated!"}
        />
      </>
    );
  }
};

export default MyProfile;

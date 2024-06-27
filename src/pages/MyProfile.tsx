import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import { DataContext } from "../App";
import Modal from "../components/modals/Modal";
import { db } from "../firebase/firebase-config";
import { updateDoc, collection, doc } from "firebase/firestore";
import Input from "../components/inputs/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";

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
  const currentUser = useContext(DataContext);
  const [updatedUserData, setUpdatedUserData] = useState<UpdatedUser | null>(
    currentUser
  );
  const [editClicked, setEditClicked] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Switch to edit mode
  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditClicked(true);
  };

  // Update state of user data
  const handleOnChangeUserData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUpdatedUserData(
      (prev) =>
        ({
          ...prev,
          [e.target.name]: e.target.value,
        } as UpdatedUser)
    );
  };

  // Update user data changes
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleSubmitUserData = async () => {
    try {
      if (updatedUserData) {
        const docRef = doc(collection(db, "user"), updatedUserData.id);
        await updateDoc(docRef, updatedUserData as { [x: string]: any });
        setOpenModal(true);
        setEditClicked(false);
        console.log("successfully updated user data.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Go back to a previous page
  const handleCancelClick = () => {
    setUpdatedUserData(currentUser);
    setEditClicked(false);
  };

  if (!updatedUserData) {
    return <Loader />;
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
          {!editClicked ? (
            <div className="flex py-[40px] w-1/2 mx-auto">
              <Button
                title="Edit"
                onClick={handleEditClick}
                btnColor="purple"
                style="w-full"
              />
            </div>
          ) : (
            <div className="flex flex-row justify-between gap-2 py-[40px] md:gap-10">
              <Button
                title="Save"
                btnColor="purple"
                onClick={handleSubmitUserData}
              />
              <Button
                title="Cancel"
                btnColor="orange"
                onClick={() => handleCancelClick()}
              />
            </div>
          )}
        </div>
        <Modal
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          message={"successfully updated!"}
        />
      </>
    );
  }
};

export default MyProfile;

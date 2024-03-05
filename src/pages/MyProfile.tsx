import { useContext, useState } from "react";
import { DataContext } from "../App";
import Modal from "../components/Modal";
import { updateUserProfile } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [editClicked, setEditClicked] = useState(false);
  const { loggedInUserData } = useContext(DataContext);
  const [updatedUserData, setUpdatedUserData] = useState(loggedInUserData);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const handleEditClick = (e) => {
    e.preventDefault();
    setEditClicked(true);
  };

  const handleOnChangeUserData = (e) => {
    setUpdatedUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitUserData = (e) => {
    e.preventDefault();
    updateUserProfile(updatedUserData);
    setOpenModal(true);
    navigate("/");
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  if (!loggedInUserData) {
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
    const {
      firstname,
      surname,
      city,
      district,
      street,
      postalCode,
      phone,
      email,
      nickname,
    } = updatedUserData;

    return (
      <>
        <div className="input-section max-w-[300px] h-screen mx-auto flex flex-col align-middle space-y-4">
          <form
            className="flex flex-col space-y-2 pb-5"
            onSubmit={handleSubmitUserData}
          >
            <label htmlFor="first-name">Email</label>
            <input
              type="text"
              id="first-name"
              className="basic-input"
              value={email}
              disabled
            />
            <label htmlFor="nickname">Nickname</label>
            <input
              type="text"
              id="nickname"
              className="basic-input"
              value={nickname}
              disabled
            />
            <label htmlFor="first-name">First Name</label>
            <input
              type="text"
              id="first-name"
              className="basic-input"
              value={firstname}
              disabled={editClicked ? false : true}
              name="firstname"
              onChange={(e) => handleOnChangeUserData(e)}
            />
            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              id="last-name"
              className="basic-input"
              value={surname}
              disabled={editClicked ? false : true}
              name="surname"
              onChange={(e) => handleOnChangeUserData(e)}
            />

            <label htmlFor="mobile">Mobile</label>
            <input
              type="phone"
              id="mobile"
              className="basic-input"
              value={phone}
              disabled={editClicked ? false : true}
              name="phone"
              onChange={(e) => handleOnChangeUserData(e)}
            />
            <div className="flex flex-col space-y-2 mb-3">
              <span>Address</span>
              <label htmlFor="street">Street</label>
              <input
                type="text"
                id="street"
                className="basic-input"
                value={street}
                disabled={editClicked ? false : true}
                name="street"
                onChange={(e) => handleOnChangeUserData(e)}
              />
              <label htmlFor="district">District</label>
              <input
                type="text"
                id="district"
                className="basic-input"
                value={district}
                disabled={editClicked ? false : true}
                name="district"
                onChange={(e) => handleOnChangeUserData(e)}
              />
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                className="basic-input"
                value={city}
                disabled={editClicked ? false : true}
                name="city"
                onChange={(e) => handleOnChangeUserData(e)}
              />
              <label htmlFor="postal-code">Postal Code</label>
              <input
                type="text"
                id="postal-code"
                className="basic-input"
                value={postalCode}
                disabled={editClicked ? false : true}
                name="postalCode"
                onChange={(e) => handleOnChangeUserData(e)}
              />
            </div>
            <div className="flex pt-3 justify-between space-x-4">
              {!editClicked ? (
                <>
                  <button
                    type="button"
                    className="btn-purple flex-1"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-orange flex-1"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button className="btn-purple flex-1">Submit</button>
              )}
            </div>
          </form>
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

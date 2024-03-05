import { useNavigate } from "react-router-dom";

const Modal = ({ openModal, setOpenModal, message }) => {
  const navigate = useNavigate();

  const handleCloseClick = () => {
    setOpenModal(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {openModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="relative p-5 flex-auto">
                  <p className="my-2 text-blueGray-500 text-lg leading-relaxed">
                    {message}
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 rounded-b space-x-4">
                  <button
                    className="btn-grey flex-1"
                    type="button"
                    onClick={handleCloseClick}
                  >
                    Close
                  </button>
                  {/* <button
                    className="btn-purple flex-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Confirm
                  </button> */}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
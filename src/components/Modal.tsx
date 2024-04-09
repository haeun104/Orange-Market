import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase-config";
import { useState } from "react";

type ModalProps = {
  openModal: boolean;
  closeModal: () => void;
  reopenModal?: () => void;
  resetCategory?: () => void;
  message: string;
  type?: string;
  id?: string;
  updateProductList?: () => void;
};

const Modal: React.FC<ModalProps> = ({
  openModal,
  closeModal,
  reopenModal,
  resetCategory,
  message,
  type,
  id,
  updateProductList,
}) => {
  const navigate = useNavigate();
  const [docDeleted, setDocDeleted] = useState(false);

  const handleCloseClick = () => {
    closeModal();
    if (type === "unauthorized" && resetCategory) {
      resetCategory();
    }
    if (type === "goToHome") {
      navigate("/", { replace: true });
    }
    if (type === "delete") {
      navigate("/my-products", { replace: true });
      if (updateProductList !== undefined) {
        updateProductList();
      }
    }
  };

  const goToLogin = () => {
    closeModal();
    navigate("/login");
  };

  // Delete product in DB
  async function deleteProduct(id: string) {
    try {
      const productRef = doc(db, "product", id);
      await deleteDoc(productRef);
      if (reopenModal) {
        reopenModal();
      }
      setDocDeleted(true);
      console.log("successfully deleted product");
    } catch (error) {
      console.log(error);
    }
  }

  const loginRequired = type === "error" || type === "unauthorized";

  if (!openModal) {
    return null;
  }
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative p-5 flex-auto">
              <p className="my-2 text-blueGray-500 text-lg leading-relaxed">
                {docDeleted ? "Successfully deleted" : message}
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
              {loginRequired && (
                <button
                  className="btn-purple flex-1 text-nowrap"
                  type="button"
                  onClick={goToLogin}
                >
                  Go to login
                </button>
              )}
              {type === "delete" && !docDeleted && (
                <button
                  className="btn-purple flex-1 text-nowrap"
                  type="button"
                  onClick={() => deleteProduct(id || "")}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Modal;

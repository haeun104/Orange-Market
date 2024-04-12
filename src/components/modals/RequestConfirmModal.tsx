import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase-config";
import { getFormattedDate } from "../../utils";

interface RequestConfirmModalProps {
  openModal: boolean;
  closeModal: () => void;
  reopenModal: () => void;
  message: string;
  type?: string;
  id?: string;
  response?: string;
  onUpdate: () => void;
  product: string;
}

const RequestConfirmModal: React.FC<RequestConfirmModalProps> = ({
  openModal,
  closeModal,
  message,
  type,
  id,
  response,
  onUpdate,
  product,
}) => {
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => {
    if (message) {
      setModalMsg(message);
    }
  }, [message]);

  // Delete request in DB
  async function deleteRequest(id: string) {
    try {
      const docRef = doc(db, "purchase request", id);
      await deleteDoc(docRef);
      onUpdate();
      console.log("successfully deleted request");
    } catch (error) {
      console.log(error);
    }
  }

  const handleClickDelete = () => {
    if (id) {
      deleteRequest(id);
    }
  };

  // Update request status in DB
  async function closeRequest(id: string, product: string, response: string) {
    try {
      const requestRef = doc(collection(db, "purchase request"), id);
      const productRef = doc(collection(db, "product"), product);
      const favoriteQuery = query(
        collection(db, "favorite"),
        where("productId", "==", product)
      );
      const favoriteSnapshot = await getDocs(favoriteQuery);
      const favorites = favoriteSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (response === "accept") {
        await updateDoc(requestRef, {
          isClosed: true,
          isChosenBySeller: true,
          closeDate: getFormattedDate(new Date()),
        });
        await updateDoc(productRef, {
          isSold: true,
        });
        await Promise.all(
          favorites.map(async (favorite) => {
            const favoriteDocRef = doc(db, "favorite", favorite.id);
            await updateDoc(favoriteDocRef, { isSold: true });
          })
        );
      } else {
        await updateDoc(requestRef, {
          isClosed: true,
          closeDate: getFormattedDate(new Date()),
        });
      }

      onUpdate();
      console.log("successfully updated request");
    } catch (error) {
      console.log(error);
    }
  }

  const handleClickConfirm = () => {
    if (id && response) {
      closeRequest(id, product, response);
    }
  };

  const handleGoBack = () => {
    closeModal();
  };

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
                {modalMsg}
              </p>
            </div>
            <div className="flex items-center justify-end p-6 rounded-b space-x-4">
              <button
                className="btn-grey flex-1 text-nowrap"
                type="button"
                onClick={handleGoBack}
              >
                Go Back
              </button>
              {type === "sales" ? (
                <button
                  className="btn-purple flex-1 text-nowrap"
                  type="button"
                  onClick={handleClickConfirm}
                >
                  Confirm
                </button>
              ) : (
                <button
                  className="btn-purple flex-1 text-nowrap"
                  type="button"
                  onClick={handleClickDelete}
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

export default RequestConfirmModal;

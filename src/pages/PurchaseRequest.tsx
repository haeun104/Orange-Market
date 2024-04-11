import { useDispatch, useSelector } from "react-redux";
import MyMarketMenu from "../components/myMarket/MyMarketMenu";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Modal from "../components/Modal";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../App";
import { fetchRequestData } from "../store/request-slice";
import { getFormattedDate } from "../utils";
import Loader from "../components/Loader";
import RequestList from "../components/requests/RequestList";
import { AppDispatch, RootState } from "../store";

const PurchaseRequest = () => {
  const selling = useSelector(
    (state: RootState) => state.request.sellingRequest
  );
  const purchase = useSelector(
    (state: RootState) => state.request.purchaseRequest
  );
  const [openModal, setOpenModal] = useState(false);

  const currentUser = useContext(DataContext);
  const dispatch: AppDispatch = useDispatch();

  // Dispatch current user data
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchRequestData(currentUser.id, "seller") as AppDispatch);
      dispatch(fetchRequestData(currentUser.id, "requestor") as AppDispatch);
    }
  }, [currentUser, dispatch]);

  const handleClosing = (id: string, product: string, type: string) => {
    closeRequestInDB(id, product, type);
  };

  async function closeRequestInDB(id: string, product: string, type: string) {
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
      if (type === "accept") {
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
      setOpenModal(true);
      if (currentUser) {
        dispatch(fetchRequestData(currentUser.id, "seller") as AppDispatch);
      }
      console.log("successfully updated request");
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteRequest = (id: string) => {
    deleteRequestInDB(id);
  };

  async function deleteRequestInDB(id: string) {
    try {
      const docRef = doc(db, "purchase request", id);
      await deleteDoc(docRef);
      setOpenModal(true);
      if (currentUser) {
        dispatch(fetchRequestData(currentUser.id, "requestor") as AppDispatch);
      }
      console.log("successfully deleted request");
    } catch (error) {
      console.log(error);
    }
  }

  if (!selling || !purchase) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="container max-w-[1280px] px-[40px]">
          <MyMarketMenu />
          <h2 className="font-bold mt-4 mb-2">For Seller</h2>
          <RequestList data={selling} type="sales" onClose={handleClosing} />
          <h2 className="font-bold mb-2">For Purchase</h2>
          <RequestList
            data={purchase}
            type="purchase"
            onDelete={handleDeleteRequest}
          />
        </div>
        <Modal
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          message="successfully updated request"
          type="requests"
        />
      </>
    );
  }
};

export default PurchaseRequest;

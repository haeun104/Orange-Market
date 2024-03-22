import { useDispatch, useSelector } from "react-redux";
import MyMarketList from "../components/MyMarket/MyMarketList";
import { Link } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase-config";
import Modal from "../components/Modal";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../App";
import { fetchRequestData } from "../store/request-slice";
import { getFormattedDate } from "../utils";

const PurchaseRequest = () => {
  const selling = useSelector((state) => state.request.sellingRequest);
  const purchase = useSelector((state) => state.request.purchaseRequest);
  const [openModal, setOpenModal] = useState(false);

  const { currentUser } = useContext(DataContext);
  const dispatch = useDispatch();

  // Dispatch current user data
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchRequestData(currentUser.id, "seller"));
      dispatch(fetchRequestData(currentUser.id, "requestor"));
    }
  }, [currentUser, dispatch]);

  const handleClosing = (id: string, product: string, type: string) => {
    closeRequestInDB(id, product, type);
  };

  async function closeRequestInDB(id, product, type) {
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
      dispatch(fetchRequestData(currentUser.id, "seller"));
      console.log("successfully updated request");
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteRequest = (id) => {
    deleteRequestInDB(id);
  };

  async function deleteRequestInDB(id) {
    try {
      const docRef = doc(db, "purchase request", id);
      await deleteDoc(docRef);
      setOpenModal(true);
      dispatch(fetchRequestData(currentUser.id, "requestor"));
      console.log("successfully deleted request");
    } catch (error) {
      console.log(error);
    }
  }

  if (!selling || !purchase) {
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
        <div className="container px-[10px]">
          <MyMarketList />
          <div className="mt-[30px]">
            <h2 className="font-bold mb-[20px]">For Seller</h2>
            <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
              <div className="flex-1">Title</div>
              <div className="flex-1">Price</div>
              <div className="flex-1">Requestor</div>
              <div className="flex-1">Request Date</div>
              <div className="flex-1">Response</div>
            </div>
            {selling.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-center sm:flex-row sm:text-center mb-2"
              >
                <Link to={`/products/${item.product}`} className="sm:w-1/5">
                  <div className="flex flex-col sm:flex-row sm:justify-center">
                    <div className="h-[120px] w-[120px] sm:h-[40px] sm:w-[70px]">
                      <img
                        src={item.imgURL}
                        alt={item.title}
                        className="h-[100%]"
                      />
                    </div>
                    <div className="flex flex-1">
                      <div className="sm:hidden w-[120px]">Title:</div>
                      <div className="sm:text-left">{item.title}</div>
                    </div>
                  </div>
                </Link>
                <div className="sm:w-1/5 flex sm:justify-center">
                  <div className="sm:hidden w-[120px]">Price:</div>
                  <div>{item.price} PLN</div>
                </div>
                <div className="sm:w-1/5 flex sm:justify-center">
                  <div className="sm:hidden w-[120px]">Requestor:</div>
                  <div>{item.requestorName}</div>
                </div>
                <div className="sm:w-1/5 flex sm:justify-center">
                  <div className="sm:hidden w-[120px]">Request Date:</div>
                  <div>{item.date}</div>
                </div>
                <div className="sm:w-1/5 flex space-x-2 sm:justify-center max-h-[40px]">
                  <button
                    className="btn-orange px-3 text-[14px]"
                    onClick={() =>
                      handleClosing(item.id, item.product, "accept")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="btn-grey px-3 text-[14px]"
                    onClick={() =>
                      handleClosing(item.id, item.product, "reject")
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {selling.length === 0 && (
              <div className="text-center text-accent-grey">
                There are no products requested for purchase
              </div>
            )}
          </div>
          <div className="mt-[30px]">
            <h2 className="font-bold mb-[20px]">For Purchaser</h2>
            <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
              <div className="w-1/5 cursor-pointer">Title</div>
              <div className="w-1/5">Price</div>
              <div className="w-1/5">Seller</div>
              <div className="w-1/5">Request Date</div>
              <div className="w-1/5">Cancel</div>
            </div>
            {purchase.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-center sm:flex-row sm:text-center mb-2"
              >
                <Link to={`/products/${item.product}`} className="sm:w-1/5">
                  <div className="flex flex-col sm:flex-row sm:justify-center">
                    <div className="h-[120px] w-[120px] sm:h-[40px] sm:w-[70px]">
                      <img
                        src={item.imgURL}
                        alt={item.title}
                        className="h-[100%]"
                      />
                    </div>
                    <div className="flex flex-1">
                      <div className="sm:hidden w-[120px]">Title:</div>
                      <div className="sm:text-left">{item.title}</div>
                    </div>
                  </div>
                </Link>
                <div className="sm:w-1/5 flex sm:justify-center">
                  <div className="sm:hidden w-[120px]">Price:</div>
                  <div>{item.price} PLN</div>
                </div>
                <div className="sm:w-1/5 flex sm:justify-center">
                  <div className="sm:hidden w-[120px]">Seller:</div>
                  <div>{item.sellerName}</div>
                </div>
                <div className="sm:w-1/5 flex sm:justify-center">
                  <div className="sm:hidden w-[120px]">Request Date:</div>
                  <div>{item.date}</div>
                </div>
                <div className="sm:w-1/5 flex space-x-2 sm:justify-center max-h-[40px]">
                  <button
                    className="btn-grey px-3 text-[14px]"
                    onClick={() => handleDeleteRequest(item.id)}
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
            ))}
            {purchase.length === 0 && (
              <div className="text-center text-accent-grey">
                There are no products requested for purchase
              </div>
            )}
          </div>
        </div>
        <Modal
          openModal={openModal}
          setOpenModal={setOpenModal}
          message="successfully updated request"
          type="goback"
        />
      </>
    );
  }
};

export default PurchaseRequest;

import { useSelector } from "react-redux";
import MyMarketList from "../components/MyMarket/MyMarketList";
import { Link } from "react-router-dom";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import Modal from "../components/Modal";
import { useState } from "react";

const PurchaseRequest = () => {
  const selling = useSelector((state) => state.request.sellingRequest);
  const purchase = useSelector((state) => state.request.purchaseRequest);
  const [openModal, setOpenModal] = useState(false);

  const handleClosing = (id, type) => {
    closeRequestInDB(id, type);
  };

  async function closeRequestInDB(id, type) {
    try {
      const requestRef = doc(collection(db, "purchase request"), id);
      if (type === "accept") {
        await updateDoc(requestRef, { isClosed: true, isChosenBySeller: true });
      } else {
        await updateDoc(requestRef, { isClosed: true });
      }
      setOpenModal(true);
      console.log("successfully updated request");
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
        <div className="container">
          <MyMarketList />
          <div className="mt-[30px]">
            <h2 className="font-bold mb-[20px]">For Seller</h2>
            <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
              <div className="flex-1">Title</div>
              <div className="flex-1">Price</div>
              <div className="flex-1">Requestor</div>
              <div className="flex-1">Response</div>
            </div>
            {selling.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-center sm:flex-row sm:text-center mb-2"
              >
                <Link to={`/products/${item.product}`} className="w-1/4">
                  <div>{item.title}</div>
                </Link>
                <div className="w-1/4">{item.price} PLN</div>
                <div className="w-1/4">{item.requestor}</div>
                <div className="w-1/4 flex space-x-2 justify-center">
                  <button
                    className="btn-orange px-3 text-[14px]"
                    onClick={() => handleClosing(item.id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn-grey px-3 text-[14px]"
                    onClick={() => handleClosing(item.id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[30px]">
            <h2 className="font-bold mb-[20px]">For Purchaser</h2>
            <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
              <div className="w-1/4 cursor-pointer">Title</div>
              <div className="w-1/4">Price</div>
              <div className="w-1/4">Seller</div>
              <div className="w-1/4">Cancel</div>
            </div>
            {purchase.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-center sm:flex-row sm:text-center mb-2"
              >
                <Link to={`/products/${item.product}`} className="w-1/4">
                  <div>{item.title}</div>
                </Link>
                <div className="w-1/4">{item.price} PLN</div>
                <div className="w-1/4">{item.seller}</div>
                <div className="w-1/4 flex space-x-2 justify-center">
                  <button className="btn-grey px-3 text-[14px]">
                    Cancel Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Modal
          openModal={openModal}
          setOpenModal={setOpenModal}
          message="successfully updated request"
          type="closing"
        />
      </>
    );
  }
};

export default PurchaseRequest;

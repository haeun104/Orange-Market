import { useContext, useEffect, useState } from "react";
import MyMarketList from "../components/MyMarket/MyMarketList";
import { DataContext } from "../App";

const PurchaseRequest = () => {
  const [selling, setSelling] = useState();
  const [purchase, setPurchase] = useState();

  const { currentUserRequest, currentUser } = useContext(DataContext);

  useEffect(() => {
    const seller = currentUserRequest.filter(
      (item) => item.seller === currentUser.id
    );
    const buyer = currentUserRequest.filter(
      (item) => item.requestor === currentUser.id
    );
    setSelling(seller);
    setPurchase(buyer);
  }, [currentUserRequest, currentUser]);

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
      <div className="container">
        <MyMarketList />
        <div className="mt-[30px]">
          <h2 className="font-bold mb-[20px]">For Seller</h2>
          <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
            <div className="flex-1">Title</div>
            <div className="flex-1">Price</div>
            <div className="flex-1">Requestor</div>            
            <div className="flex-1">Status</div>
            <div className="flex-1">Response</div>
          </div>
          {selling.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:text-center">
              <div className="flex-1">{item.title}</div>
              <div className="flex-1">{item.price} PLN</div>
              <div className="flex-1">{item.requestor}</div>
              <div className="flex-1">
                {item.isClosed ? "Closed" : "Pending response"}
              </div>
              <div className="flex-1">
                <button>Accept</button>
                <button>Reject</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[30px]">
          <h2 className="font-bold mb-[20px]">For Purchaser</h2>
          <div className="hidden sm:flex">
            <div className="flex-1">Title</div>
            <div className="flex-1">Price</div>
            <div className="flex-1">Status</div>
            <div className="flex-1">Cancel</div>
          </div>
        </div>
      </div>
    );
  }
};

export default PurchaseRequest;

import { useDispatch, useSelector } from "react-redux";
import MyMarketList from "../components/MyMarket/MyMarketList";
import { useContext, useEffect } from "react";
import { DataContext } from "../App";
import { fetchRequestData } from "../store/request-slice";
import { Link } from "react-router-dom";

const PurchaseHistory = () => {
  const purchase = useSelector((state) => state.request.closedPurchaseRequest);
  const dispatch = useDispatch();

  const { currentUser } = useContext(DataContext);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchRequestData(currentUser.id, "requestorClosed"));
    }
  }, [currentUser, dispatch]);

  if (!purchase) {
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
        <div className="mt-[40px]">
          <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
            <div className="flex-1">Title</div>
            <div className="flex-1">Price</div>
            <div className="flex-1">Seller</div>
            <div className="flex-1">Request Date</div>
            <div className="flex-1">Status</div>
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
              <div className="sm:w-1/5 flex sm:justify-center">
                <div className="sm:hidden w-[120px]">Status</div>
                <div>{item.isChosenBySeller ? "Accepted" : "Rejected"}</div>
              </div>
            </div>
          ))}
          {purchase.length === 0 && (
            <div className="text-center text-accent-grey">
              There are no purchase history
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default PurchaseHistory;

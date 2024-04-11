import { useDispatch, useSelector } from "react-redux";
import MyMarketMenu from "../components/myMarket/MyMarketMenu";
import { useContext, useEffect } from "react";
import { DataContext } from "../App";
import { fetchRequestData } from "../store/request-slice";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import Loader from "../components/Loader";
import { RequestType } from "../types";

const SalesHistory = () => {
  const selling = useSelector(
    (state: RootState) => state.request.closedSellingRequest
  );
  const dispatch: AppDispatch = useDispatch();

  const currentUser = useContext(DataContext);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchRequestData(currentUser.id, "sellerClosed") as AppDispatch);
    }
  }, [currentUser, dispatch]);

  if (!selling) {
    return <Loader />;
  } else {
    return (
      <div className="container max-w-[1280px] px-[40px]">
        <MyMarketMenu />
        <div className="mt-[40px]">
          <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
            <div className="flex-1">Title</div>
            <div className="flex-1">Price</div>
            <div className="flex-1">Requestor</div>
            <div className="flex-1">Request Date</div>
            <div className="flex-1">Status</div>
          </div>
          {selling.map((item: RequestType) => (
            <div
              key={item.id}
              className="flex flex-col justify-center sm:flex-row sm:text-center mb-2"
            >
              <Link to={`/products/${item.product}`} className="sm:w-1/5">
                <div className="flex flex-col sm:flex-row sm:justify-center">
                  <div className="h-[120px] w-[120px] sm:h-[40px] sm:w-[70px] mr-[10px]">
                    <img
                      src={item.imgURL}
                      alt={item.title}
                      className="h-full w-full rounded-md"
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
              <div className="sm:w-1/5 flex sm:justify-center">
                <div className="sm:hidden w-[120px]">Status</div>
                <div>{item.isChosenBySeller ? "Accepted" : "Rejected"}</div>
              </div>
            </div>
          ))}
          {selling.length === 0 && (
            <div className="text-center text-accent-grey">
              There are no sales history
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default SalesHistory;

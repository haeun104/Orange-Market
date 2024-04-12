import { useDispatch, useSelector } from "react-redux";
import MyMarketMenu from "../components/myMarket/MyMarketMenu";
import { useContext, useEffect } from "react";
import { DataContext } from "../App";
import { fetchRequestData } from "../store/request-slice";
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

  const currentUser = useContext(DataContext);
  const dispatch: AppDispatch = useDispatch();

  // Dispatch current user data
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchRequestData(currentUser.id, "seller") as AppDispatch);
      dispatch(fetchRequestData(currentUser.id, "requestor") as AppDispatch);
    }
  }, [currentUser, dispatch]);

  // Update request data after user confirms
  const updateRequestList = () => {
    if (currentUser) {
      dispatch(fetchRequestData(currentUser.id, "requestor") as AppDispatch);
      dispatch(fetchRequestData(currentUser.id, "seller") as AppDispatch);
    }
  };

  if (!selling || !purchase) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="container max-w-[1280px] px-[40px]">
          <MyMarketMenu />
          <h2 className="font-bold mt-4 mb-2">For Seller</h2>
          <RequestList
            data={selling}
            type="sales"
            onUpdate={updateRequestList}
          />
          <h2 className="font-bold mb-2">For Purchase</h2>
          <RequestList
            data={purchase}
            type="purchase"
            onUpdate={updateRequestList}
          />
        </div>
      </>
    );
  }
};

export default PurchaseRequest;

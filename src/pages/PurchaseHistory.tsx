import { useDispatch, useSelector } from "react-redux";
import MyMarketMenu from "../components/myMarket/MyMarketMenu";
import { useContext, useEffect } from "react";
import { DataContext } from "../App";
import { fetchRequestData } from "../store/request-slice";
import RequestHistory from "../components/requests/RequestHistory";
import Loader from "../components/Loader";
import { AppDispatch, RootState } from "../store";

const PurchaseHistory = () => {
  const purchase = useSelector(
    (state: RootState) => state.request.closedPurchaseRequest
  );
  const dispatch: AppDispatch = useDispatch();

  const currentUser = useContext(DataContext);

  useEffect(() => {
    if (currentUser) {
      dispatch(
        fetchRequestData(currentUser.id, "requestorClosed") as AppDispatch
      );
    }
  }, [currentUser, dispatch]);

  if (!purchase) {
    return <Loader />;
  } else {
    return (
      <div className="container max-w-[1280px] px-[40px]">
        <MyMarketMenu />
        <RequestHistory data={purchase} type="purchase" />
      </div>
    );
  }
};

export default PurchaseHistory;

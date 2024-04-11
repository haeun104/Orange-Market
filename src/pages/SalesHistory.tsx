import { useDispatch, useSelector } from "react-redux";
import MyMarketMenu from "../components/myMarket/MyMarketMenu";
import { useContext, useEffect } from "react";
import { DataContext } from "../App";
import { fetchRequestData } from "../store/request-slice";
import { AppDispatch, RootState } from "../store";
import Loader from "../components/Loader";
import RequestHistory from "../components/history/RequestHistory";

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
        <RequestHistory data={selling} type="sales" />
      </div>
    );
  }
};

export default SalesHistory;

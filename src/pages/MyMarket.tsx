import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataContext } from "../App";
import { fetchFavoriteData } from "../store/favorite-slice";
import { fetchRequestData } from "../store/request-slice";

const MyMarket = () => {
  const favoriteList = useSelector((state) => state.favorite.favoriteItem);
  const sellingList = useSelector((state) => state.request.sellingRequest);
  const purchaseList = useSelector((state) => state.request.purchaseRequest);
  const requests = [...sellingList, ...purchaseList];

  const dispatch = useDispatch();

  const { currentUser } = useContext(DataContext);

  // Dispatch current user data
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchRequestData(currentUser.id, "seller"));
      dispatch(fetchRequestData(currentUser.id, "requestor"));
      dispatch(fetchFavoriteData(currentUser.id));
    }
  }, [currentUser, dispatch]);

  if (!favoriteList || !requests) {
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
        <div className="mt-[50px] relative">
          <h2 className="uppercase font-bold text-[18px] border-black border-solid border-b-[2px]">
            my favorite
          </h2>
          <Link to="/my-favorite">
            <span className="absolute top-0 right-0 hover:text-gray-500">
              Go to details
            </span>
          </Link>
          <div>
            {favoriteList.map((item) => (
              <ul key={item.id} className="flex space-x-4">
                <li className="">
                  <img src={item.imgURL} alt={item.title} />
                </li>
                <li className="flex-1 text-center">{item.title}</li>
                <li>{item.price}PLN</li>
                <li>{item.isSold ? "sold" : "onSale"}</li>
              </ul>
            ))}
          </div>
        </div>
        <div className="mt-[50px] relative">
          <h2 className="uppercase font-bold text-[18px] border-black border-solid border-b-[2px]">
            sales history
          </h2>
          <Link to="/sales-history">
            <span className="absolute top-0 right-0 cursor-pointer hover:text-gray-500">
              Go to details
            </span>
          </Link>
        </div>
        <div className="mt-[50px] relative">
          <h2 className="uppercase font-bold text-[18px] border-black border-solid border-b-[2px]">
            purchase history
          </h2>
          <Link to="/purchase-history">
            <span className="absolute top-0 right-0 cursor-pointer hover:text-gray-500">
              Go to details
            </span>
          </Link>
        </div>
        <div className="mt-[50px] relative">
          <h2 className="uppercase font-bold text-[18px] border-black border-solid border-b-[2px]">
            purchase requests
          </h2>
          <Link to="/purchase-request">
            <span className="absolute top-0 right-0 cursor-pointer hover:text-gray-500">
              Go to details
            </span>
          </Link>
          <div>
            {requests.map((item) => (
              <ul key={item.id} className="flex space-x-4">
                <li className="">
                  <img src={item.imgURL} alt={item.title} />
                </li>
                <li className="flex-1 text-center">{item.title}</li>
                <li>{item.price}PLN</li>
                <li>{item.isClosed ? "Sold" : "Pending response"}</li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default MyMarket;

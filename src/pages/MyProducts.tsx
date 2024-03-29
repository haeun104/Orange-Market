import { useContext } from "react";
import { DataContext } from "../App";
import MyMarketList from "../components/MyMarket/MyMarketList";
import ProductListPerUser from "../components/Products/ProductListPerUser";

const MyProducts = () => {
  const { currentUser } = useContext(DataContext);

  if (!currentUser) {
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
      <div className="container px-[10px]">
        <MyMarketList />
        <ProductListPerUser id={currentUser.id} type="myproduct"/>
      </div>
    );
  }
};

export default MyProducts;

import { useContext } from "react";
import { DataContext } from "../App";
import MyMarketMenu from "../components/myMarket/MyMarketMenu";
import ProductListPerUser from "../components/products/ProductListPerUser";
import Loader from "../components/Loader";

const MyProducts = () => {
  const currentUser = useContext(DataContext);

  if (!currentUser) {
    return <Loader />;
  } else {
    return (
      <div className="container max-w-[1280px] px-[40px]">
        <MyMarketMenu />
        <ProductListPerUser id={currentUser.id} type="myproduct" />
      </div>
    );
  }
};

export default MyProducts;

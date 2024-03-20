import { useContext } from "react";
import { DataContext } from "../App";
import MyMarketList from "../components/MyMarket/MyMarketList";
import ProductListPerUser from "../components/Products/ProductListPerUser";

const MyProducts = () => {
  const { currentUser } = useContext(DataContext);

  return (
    <div className="container px-[10px]">
      <MyMarketList />
      <ProductListPerUser id={currentUser.id} />
    </div>
  );
};

export default MyProducts;

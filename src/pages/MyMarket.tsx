import { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../App";

const MyMarket = () => {
  const { currentUserFavorite } = useContext(DataContext);

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
          {currentUserFavorite.map((item) => (
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
      </div>
    </div>
  );
};

export default MyMarket;

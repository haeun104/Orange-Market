import { useContext } from "react";
import MyMarketList from "../components/MyMarket/MyMarketList";
import { DataContext } from "../App";
import { useNavigate } from "react-router-dom";

const MyFavorite = () => {
  const { currentUserFavorite } = useContext(DataContext);

  const navigate = useNavigate();

  const goToProducDetail = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (!currentUserFavorite) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-[20px]">
          {currentUserFavorite.map((item) => (
            <>
              <div key={item.id}>
                <div className="h-[200px]">
                  <img
                    src="src\assets\chair.jpg"
                    alt={item.title}
                    className="h-[100%]"
                  />
                </div>
                <div
                  className="flex flex-col text-gray-400 cursor-pointer"
                  onClick={() => goToProducDetail(item.productId)}
                >
                  <h4 className="text-black font-bold">{item.title}</h4>
                  <span className="text-black font-bold">{item.price} PLN</span>
                  <span>{`${item.city}, ${item.district}`}</span>
                  <div className="flex space-x-2 text-sm">
                    <span>Click {item.clickCount}</span>
                    <span>Like {item.likeCount}</span>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    );
  }
};

export default MyFavorite;

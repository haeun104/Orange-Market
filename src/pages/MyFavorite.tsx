import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MyMarketMenu from "../components/myMarket/MyMarketMenu";

const MyFavorite = () => {
  const favoriteList = useSelector((state) => state.favorite.favoriteItem);
  const navigate = useNavigate();

  const goToProductDetail = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (!favoriteList) {
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
        <MyMarketMenu />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-[20px]">
          {favoriteList.map((item) => (
            <div key={item.id}>
              <div className="h-[200px]">
                <img src={item.imgURL} alt={item.title} className="h-[100%]" />
              </div>
              <div
                className="flex flex-col text-gray-400 cursor-pointer"
                onClick={() => goToProductDetail(item.productId)}
              >
                <h4 className="text-black font-bold">{item.title}</h4>
                <span className="text-black font-bold">{item.price} PLN</span>
                <span>{`${item.city}, ${item.district}`}</span>
              </div>
            </div>
          ))}
        </div>
        {favoriteList.length === 0 && (
          <div className="text-center">
            There are no products added to favorites
          </div>
        )}
      </div>
    );
  }
};

export default MyFavorite;

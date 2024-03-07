import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../App";

const Products = () => {
  const navigate = useNavigate();
  const { productsList } = useContext(DataContext);

  const goToNewProductPage = () => {
    navigate("/products/new");
  };

  const goToProductDetailPage = (id) => {
    navigate(`/products/${id}`);
  };

  if (productsList.length === 0) {
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
      <div className="container max-w-[1280px] relative">
        <h2 className="text-lg font-bold text-center mb-8">PRODUCT LIST</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 lg:px-[150px]">
          {productsList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-center mx-auto w-[250px] cursor-pointer"
              onClick={() => goToProductDetailPage(item.id)}
            >
              <div className="">
                <img src="src\assets\chair.jpg" alt={item.title} />
              </div>
              <div className="flex flex-col text-gray-400">
                <h4 className="text-black">{item.title}</h4>
                <span className="text-black">{item.price} PLN</span>
                <span>{`${item.city}, ${item.district}`}</span>
                <div className="flex space-x-2 text-sm">
                  <span>Click {item.clickCount}</span>
                  <span>Like {item.likeCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-[40px] right-[10px] md:top-0 md:right-[40px] text-center">
          <button
            className="bg-main-orange hover:opacity-80 text-white font-bold rounded-[50%] w-[30px] h-[30px] text-[16px] md:w-[40px] md:h-[40px] md:text-[24px]"
            onClick={goToNewProductPage}
          >
            +
          </button>
          <div className="text-main-orange font-bold text-sm text-center">
            Register <br />
            your product!
          </div>
        </div>
      </div>
    );
  }
};

export default Products;

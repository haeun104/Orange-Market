import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();

  const goToNewProductPage = () => {
    navigate("/products/new");
  };

  return (
    <div className="container max-w-[1280px] relative">
      <h2 className="text-lg font-bold text-center mb-8">PRODUCT LIST</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 lg:px-[150px]">
        <div className="flex flex-col justify-center mx-auto w-[250px]">
          <div className="">
            image box
            <img
              src="https://firebasestorage.googleapis.com/v0/b/orange-market-46529.appspot.com/o/images%2Fluki123_clock.jpg?alt=media&token=dcd2a5a4-7c8d-497c-b925-c3161f82e8d3"
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <h4>title</h4>
            <span>price</span>
            <span>location</span>
            <div className="flex space-x-2">
              <span>click count: 0</span>
              <span>like count: 0</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mx-auto w-[250px]">
          <div>image box</div>
          <div className="flex flex-col">
            <h4>title</h4>
            <span>price</span>
            <span>location</span>
            <div className="flex space-x-2">
              <span>click count: 0</span>
              <span>like count: 0</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mx-auto w-[250px]">
          <div>image box</div>
          <div className="flex flex-col">
            <h4>title</h4>
            <span>price</span>
            <span>location</span>
            <div className="flex space-x-2">
              <span>click count: 0</span>
              <span>like count: 0</span>
            </div>
          </div>
        </div>
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
};

export default Products;

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../App";

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [sellerName, setSellerName] = useState("");
  const productId = useParams();
  const { productsList, usersList } = useContext(DataContext);

  const navigate = useNavigate();

  // Find product details based on product id
  useEffect(() => {
    const product = productsList.find((prod) => prod.id === productId.id);
    setProduct(product);

    if (product) {
      const seller = usersList.find((user) => user.id === product.seller);
      setSellerName(seller.nickname);
    }
  }, [productsList, productId, usersList]);

  // Go to seller's product list
  const goToSellerProductList = (sellerId: string) => {
    navigate(`/products/seller/${sellerId}`);
  };

  if (!product) {
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
        <div className="flex flex-col justify-center mx-auto w-[250px] md:w-[400px] lg:w-[600px]">
          <div className="h-[50vh]">
            <img src="src\assets\chair.jpg" alt={product.title} />
          </div>
          <div className="flex flex-col text-gray-400">
            <h4 className="text-black">{product.title}</h4>
            <span className="text-black">{product.price} PLN</span>
            <span
              className="cursor-pointer underline"
              onClick={() => goToSellerProductList(product.seller)}
            >
              {sellerName}
            </span>
            <span>{`${product.city}, ${product.district}`}</span>
            <div className="flex space-x-2 text-sm">
              <span>Click {product.clickCount}</span>
              <span>Like {product.likeCount}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2 mt-4 mb-4">
            <button
              className="btn-orange disabled:bg-gray-300 cursor-not-allowed disabled:hover:opacity-100"
              disabled={product.isSold ? true : false}
            >
              Add to your favorite list
            </button>
            <button
              className="btn-orange disabled:bg-gray-300 cursor-not-allowed disabled:hover:opacity-100"
              disabled={product.isSold ? true : false}
            >
              Chat with a seller
            </button>
            <button
              className="btn-purple disabled:bg-gray-300 cursor-not-allowed disabled:hover:opacity-100"
              disabled={product.isSold ? true : false}
            >
              Make a purchase request
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductDetail;

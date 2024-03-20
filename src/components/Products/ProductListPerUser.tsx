import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase-config";

const ProductListPerUser = ({ id }) => {
  const [products, setProducts] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id]);

  // Fetch product and seller data from DB
  async function fetchProductData(sellerId: string) {
    try {
      const productQuery = query(
        collection(db, "product"),
        where("seller", "==", sellerId)
      );
      const productSnapshot = await getDocs(productQuery);

      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.log(error);
    }
  }

  // Go to product details
  const goToProductDetailPage = (id: string) => {
    navigate(`/products/${id}`);
  };

  if (!products) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-[20px]">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-center mx-auto w-[250px] cursor-pointer"
              onClick={() => goToProductDetailPage(item.id)}
            >
              <div className="h-[200px]">
                <img
                  src={item.imgURL}
                  alt={item.title}
                  className="max-h-[100%]"
                />
              </div>
              <div className="flex flex-col text-gray-400">
                <h4 className="text-black">{item.title}</h4>
                <span className="text-black">{item.price} PLN</span>
                <span>{`${item.city}, ${item.district}`}</span>
                <div className="flex space-x-2 text-sm">
                  <span>Click {item.clickCount}</span>
                  <span>Like {item.likeCount}</span>
                </div>
                <span className="">
                  Status: {item.isSold ? "Sold" : "on sale"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ProductListPerUser;

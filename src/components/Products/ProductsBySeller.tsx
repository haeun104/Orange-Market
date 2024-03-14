import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase-config";

const ProductsBySeller = () => {
  const [products, setProducts] = useState();
  const [sellerName, setSellerName] = useState("");
  const { seller } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (seller) {
      fetchProductData(seller);
    }
  }, [seller]);

  // Fetch product and seller data from DB
  async function fetchProductData(sellerId: string) {
    try {
      const userRef = doc(db, "user", sellerId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setSellerName(userData.nickname);
      } else {
        console.log("There is no seller data");
        setSellerName("");
      }

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

  if (!products || !sellerName) {
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
      <div className="container max-w-[1280px]">
        <h2 className="text-lg font-bold text-center mb-8">
          <span className="text-accent-purple">{sellerName}</span>'s Selling
          List
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 lg:px-[150px]">
          {products.map((item) => (
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

export default ProductsBySeller;

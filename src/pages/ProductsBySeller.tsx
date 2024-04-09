import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase-config";
import ProductListPerUser from "../components/products/ProductListPerUser";

const ProductsBySeller = () => {
  const [sellerName, setSellerName] = useState("");
  const { seller } = useParams();

  useEffect(() => {
    if (seller) {
      fetchSellerName(seller);
    }
  }, [seller]);

  // Fetch seller name from DB
  async function fetchSellerName(sellerId: string) {
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
    } catch (error) {
      console.log(error);
    }
  }

  if (!sellerName) {
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
        <ProductListPerUser id={seller} />
      </div>
    );
  }
};

export default ProductsBySeller;

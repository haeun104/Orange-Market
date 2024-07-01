import { Navigate, useParams } from "react-router-dom";
import ProductForm from "../components/products/ProductForm";
import { useContext, useEffect, useState } from "react";
import { fetchProductDetails } from "../firebase/firebase-action";
import NotFound from "../components/NotFount";
import { ProductType } from "../types";
import { DataContext } from "../App";

const EditProduct = () => {
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState<
    ProductType | undefined
  >();

  const currentUser = useContext(DataContext);

  useEffect(() => {
    const productDetails = async () => {
      const product = await fetchProductDetails(productId);
      if (product) {
        setProductDetails(product as ProductType | undefined);
      }
    };
    productDetails();
  }, [productId]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!productDetails) {
    return <NotFound />;
  }

  return (
    <div className="container px-5 py-10">
      <h2 className="text-center text-lg text-main-orange font-bold uppercase mb-[20px]">
        edit your product
      </h2>
      <ProductForm type="edit" initialData={productDetails} />
    </div>
  );
};

export default EditProduct;

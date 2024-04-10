import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase-config";
import Modal from "../Modal";
import { ProductType } from "../../types";
import Loader from "../Loader";
import Button from "../Button";

interface ProductPerUser {
  id: string | undefined;
  type?: string;
}

interface ProductWithId extends ProductType {
  id: string;
}

const ProductListPerUser: React.FC<ProductPerUser> = ({ id, type }) => {
  const [products, setProducts] = useState<ProductWithId[]>();
  const [openModal, setOpenModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id]);

  const updateProductList = () => {
    if (id) {
      fetchProductData(id);
    }
  };

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
      })) as ProductWithId[];
      setProducts(productList);
    } catch (error) {
      console.log(error);
    }
  }

  // Go to product details
  const goToProductDetailPage = (id: string) => {
    navigate(`/products/${id}`);
  };

  // Go to edit page
  const goToEditPage = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  //
  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setOpenModal(true);
  };

  if (!products) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-[20px]">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex flex-col mx-auto w-[250px] cursor-pointer"
            >
              <div className="h-[200px]">
                <img
                  src={item.imgURL}
                  alt={item.title}
                  className="h-full w-full rounded-lg"
                />
              </div>
              <div
                className="flex flex-col text-gray-400"
                onClick={() => goToProductDetailPage(item.id)}
              >
                <h4 className="text-black">{item.title}</h4>
                <span className="text-black">{item.price} PLN</span>
                <span>{`${item.city}, ${item.district}`}</span>
                <div className="flex space-x-2 text-sm">
                  <span>Click {item.clickCount}</span>
                  <span>Like {item.likeCount}</span>
                </div>
                <span>Status: {item.isSold ? "Sold" : "on sale"}</span>
              </div>
              {!item.isSold && type === "myproduct" && (
                <div className="flex space-x-2 mt-[10px]">
                  <Button
                    title="Edit"
                    onClick={() => goToEditPage(item.id)}
                    btnColor="orange"
                  />
                  <Button
                    btnColor="grey"
                    onClick={() => handleDeleteClick(item.id)}
                    title="Delete"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <Modal
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          reopenModal={() => setOpenModal(true)}
          message="Are you sure to delete?"
          type="delete"
          id={productToDelete}
          updateProductList={updateProductList}
        />
      </>
    );
  }
};

export default ProductListPerUser;

import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase-config";
import Modal from "../Modal";

interface ProductPerUser {
  id: string | undefined;
  type?: string;
}

interface ProductType {
  title: string;
  description: string;
  price: number;
  category: string;
  date: string;
  clickCount: number;
  likeCount: number;
  seller: string;
  buyer: string;
  isSold: boolean;
  imgURL: string;
  city: string;
  district: string;
  id: string;
}

const ProductListPerUser: React.FC<ProductPerUser> = ({ id, type }) => {
  const [products, setProducts] = useState<ProductType[]>();
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
      })) as ProductType[];
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
      <>
        <div className="container">
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
                    className="max-h-full w-full rounded-lg"
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
                  <span className="">
                    Status: {item.isSold ? "Sold" : "on sale"}
                  </span>
                </div>
                {!item.isSold && type === "myproduct" && (
                  <div className="flex space-x-2 mt-[10px]">
                    <button
                      className="btn-orange"
                      onClick={() => goToEditPage(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-grey"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
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

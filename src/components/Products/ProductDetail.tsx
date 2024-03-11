import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../App";
import { addDoc, collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Modal from "../Modal";

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [sellerName, setSellerName] = useState("");
  const [existingFavorite, setExistingFavorite] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const productId = useParams();
  const { productsList, usersList, loggedInUserData, favoriteList } =
    useContext(DataContext);

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

  useEffect(() => {
    if (loggedInUserData) {
      const currentUserFavorite = favoriteList.find(
        (item) =>
          item.productId === productId.id && item.userId === loggedInUserData.id
      );
      if (currentUserFavorite) {
        setExistingFavorite(true);
      }
    }
  }, [favoriteList, loggedInUserData, productId]);

  // Go to seller's product list
  const goToSellerProductList = (sellerId: string) => {
    navigate(`/products/seller/${sellerId}`);
  };

  // Add a product to favorites in DB
  async function addFavoriteInDb(favorite) {
    try {
      await addDoc(collection(db, "favorite"), favorite);
      setOpenModal(true);
      console.log("successfully added favorite.");
    } catch (error) {
      console.error(error);
    }
  }

  // Remove a product from favorites in DB

  async function deleteFavoriteInDb(docId: string) {
    try {
      const docRef = doc(db, "favorite", docId);
      await deleteDoc(docRef);
      setExistingFavorite(false);
      setOpenModal(true);
      console.log("successfully deleted favorite.");
    } catch (error) {
      console.error(error);
    }
  }

  // Send favorite to DB
  const addToFavorites = () => {
    const favorite = {
      userId: loggedInUserData.id,
      productId: productId.id,
    };
    if (existingFavorite) {
      const currentUserFavorite = favoriteList.find(
        (item) =>
          item.productId === productId.id && item.userId === loggedInUserData.id
      );
      deleteFavoriteInDb(currentUserFavorite.docId);
    } else {
      addFavoriteInDb(favorite);
    }
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
      <>
        <div className="container">
          <div className="flex flex-col justify-center mx-auto w-[250px] md:w-[400px] lg:w-[600px]">
            <div className="h-[50vh]">
              <img src="src\assets\chair.jpg" alt={product.title} />
            </div>
            <div className="flex flex-col text-gray-400">
              <h4 className="text-black font-bold">{product.title}</h4>
              <span className="text-black font-bold">{product.price} PLN</span>
              <span
                className="cursor-pointer underline"
                onClick={() => goToSellerProductList(product.seller)}
              >
                {sellerName}
              </span>
              <span>{`${product.city}, ${product.district}`}</span>
              <p className="my-[20px]">{product.description}</p>
              <div className="flex space-x-2 text-sm">
                <span>Click {product.clickCount}</span>
                <span>Like {product.likeCount}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2 mt-4 mb-4">
              <button
                className="btn-orange disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:opacity-100"
                disabled={product.isSold ? true : false}
                onClick={addToFavorites}
              >
                {existingFavorite
                  ? "Remove from my favorite list"
                  : "Add to your favorite list"}
              </button>
              <button
                className="btn-orange disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:opacity-100"
                disabled={product.isSold ? true : false}
              >
                Chat with a seller
              </button>
              <button
                className="btn-purple disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:opacity-100"
                disabled={product.isSold ? true : false}
              >
                Make a purchase request
              </button>
            </div>
          </div>
        </div>
        <Modal
          openModal={openModal}
          setOpenModal={setOpenModal}
          message={
            existingFavorite
              ? "successfully added favorite."
              : "successfully deleted favorite!"
          }
          type="favorite"
        />
      </>
    );
  }
};

export default ProductDetail;

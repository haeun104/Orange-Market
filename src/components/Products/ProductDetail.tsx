import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../App";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Modal from "../modals/Modal";
import { useDispatch } from "react-redux";
import Button from "../Button";
import Loader from "../Loader";
import { AppDispatch } from "../../store";
import { ProductType } from "../../types/index";
import {
  deleteFavorites,
  fetchProductDetails,
} from "../../firebase/firebase-action";
import { cartActions } from "../../store/cart-slice";

const ProductDetail = () => {
  const [product, setProduct] = useState<ProductType>();
  const [existingFavorite, setExistingFavorite] = useState<boolean>();
  const [availableForOrder, setAvailableForOrder] = useState<boolean>();
  const [openModal, setOpenModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [requestBtn, setRequestBtn] = useState("");

  const { productId } = useParams();

  const dispatch: AppDispatch = useDispatch();

  const currentUser = useContext(DataContext);

  const navigate = useNavigate();

  // Fetch product details from DB
  useEffect(() => {
    if (productId) {
      const productDetail = async () => {
        const details = await fetchProductDetails(productId);
        setProduct(details as ProductType);
        if (details && details.isSold) {
          setAvailableForOrder(false);
          setRequestBtn("Product is already sold");
        } else {
          checkRequestStatus(productId);
        }
      };
      productDetail();
    }
  }, [productId]);

  // Fetch status if the product is available for ordering
  async function checkRequestStatus(productId: string) {
    try {
      const requestQuery = query(
        collection(db, "purchase request"),
        where("product", "==", productId),
        where("isClosed", "==", false)
      );
      const requestSnapshot = await getDocs(requestQuery);

      if (!requestSnapshot.empty) {
        setRequestBtn("Waiting for response on purchase request");
        setAvailableForOrder(false);
      } else {
        setRequestBtn("Add to cart");
        setAvailableForOrder(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (currentUser && productId) {
      const fetchFavoriteStatus = async () => {
        const isExistingFavorite = await checkFavoritesStatus(
          currentUser.id,
          productId
        );
        setExistingFavorite(isExistingFavorite);
      };
      fetchFavoriteStatus();
    }
  }, [currentUser, productId]);

  // Check if favorite exists in DB
  async function checkFavoritesStatus(userId: string, itemId: string) {
    try {
      const userRef = doc(db, "user", userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData && Array.isArray(userData.favorites)) {
          return userData.favorites.includes(itemId);
        }
      }

      return false;
    } catch (error) {
      console.log(error);
    }
  }

  // Add a product to favorites in DB
  async function handleAddFavorites(userId: string, itemId: string) {
    try {
      const userRef = doc(collection(db, "user"), userId);
      await updateDoc(userRef, { favorites: arrayUnion(itemId) });

      const productRef = doc(collection(db, "product"), itemId);
      const docSnap = await getDoc(productRef);
      const product = docSnap.data();

      if (product) {
        const currentLike = product.likeCount ? parseInt(product.likeCount) : 0;

        await updateDoc(productRef, { likeCount: currentLike + 1 });

        setModalMsg("successfully added favorite!");
        setOpenModal(true);
        const favoriteStatus = await checkFavoritesStatus(userId, itemId);
        setExistingFavorite(favoriteStatus);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Remove a product from favorites in DB
  async function handleDeleteFavorites(userId: string, itemId: string) {
    try {
      await deleteFavorites(userId, itemId);
      setModalMsg("successfully deleted favorite!");
      setOpenModal(true);
      const favoriteStatus = await checkFavoritesStatus(userId, itemId);
      setExistingFavorite(favoriteStatus);
    } catch (error) {
      console.error(error);
    }
  }

  // Add or remove favorites depending on its existence
  const handleFavoriteClick = () => {
    if (!currentUser) {
      setModalMsg("Please login first");
      setOpenModal(true);
      return;
    }
    if (productId) {
      if (!existingFavorite) {
        handleAddFavorites(currentUser.id, productId);
      } else {
        handleDeleteFavorites(currentUser.id, productId);
      }
    }
  };

  // Add the selected product to user's cart
  const addProductToCart = () => {
    dispatch(cartActions.addToCart({ ...product, product: productId }));
  };

  // Go to seller's product list
  const goToSellerProductList = (sellerId: string) => {
    navigate(`/products/seller/${sellerId}`);
  };

  // Open chat page
  const handleChatClick = () => {
    if (!currentUser) {
      setModalMsg("Please login first");
      setOpenModal(true);
      return;
    }
    if (product && currentUser.id === product.seller) {
      setModalMsg("This is your product. Chat is not available.");
      setOpenModal(true);
      return;
    }
    if (product) {
      navigate(`/chat/${product.seller}`);
    }
  };

  if (!product) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="container py-[40px]">
          <h2 className="text-lg font-bold text-center mb-8">
            PRODUCT DETAILS
          </h2>
          <div className="flex flex-col justify-center mx-auto w-[250px] md:w-[400px] lg:w-[600px]">
            <div className="w-full">
              <img
                src={product.imgURL}
                alt={product.title}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col text-gray-400">
              <h4 className="text-black font-bold">{product.title}</h4>
              <span className="text-black font-bold">{product.price} PLN</span>
              <div>
                <span
                  className="cursor-pointer underline"
                  onClick={() => goToSellerProductList(product.seller)}
                >
                  {product.sellerName}
                </span>
              </div>
              <span>{`${product.city}, ${product.district}`}</span>
              <span>registered on {product.date}</span>
              <div className="flex space-x-2 text-sm">
                <span>Click {product.clickCount}</span>
                <span>Like {product.likeCount}</span>
              </div>
              <p className="my-[20px]">{product.description}</p>
            </div>
            {product.isSold ? (
              <div className="text-red-400 font-bold">
                This product has already been sold
              </div>
            ) : null}
            <div className="flex flex-col gap-2 mt-4">
              <Button
                title={
                  existingFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
                onClick={handleFavoriteClick}
                btnColor="orange"
                disabled={product.isSold ? true : false}
              />
              <Button
                title="Chat with a seller"
                btnColor="orange"
                disabled={product.isSold ? true : false}
                onClick={handleChatClick}
              />
              <Button
                title={requestBtn}
                onClick={addProductToCart}
                btnColor="purple"
                disabled={product.isSold || !availableForOrder ? true : false}
              />
            </div>
          </div>
        </div>
        <Modal
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          message={modalMsg}
          type={currentUser ? "goback" : "error"}
        />
      </>
    );
  }
};

export default ProductDetail;

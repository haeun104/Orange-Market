import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../App";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Modal from "../modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteData } from "../../store/favorite-slice";
import Button from "../Button";
import Loader from "../Loader";
import { AppDispatch, RootState } from "../../store";
import { FavoriteType, ProductType } from "../../types/index";
import { fetchProductDetails } from "../../firebase/firebase-action";
import { cartActions } from "../../store/cart-slice";

interface NewFavorite {
  city: string;
  district: string;
  imgURL: string;
  isSold: boolean;
  price: string;
  productId: string;
  title: string;
  userId: string;
}

const ProductDetail = () => {
  const [product, setProduct] = useState<ProductType>();
  const [existingFavorite, setExistingFavorite] = useState(false);
  const [existingFavoriteId, setExistingFavoriteId] = useState("");
  const [availableForOrder, setAvailableForOrder] = useState<boolean>();
  const [openModal, setOpenModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [requestBtn, setRequestBtn] = useState("");

  const { productId } = useParams();
  const favorite: FavoriteType[] = useSelector(
    (state: RootState) => state.favorite.favoriteItem
  );
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
    if (currentUser) {
      dispatch(fetchFavoriteData(currentUser.id));
    }
  }, [existingFavorite, currentUser, dispatch]);

  // Check if favorite exists in DB
  useEffect(() => {
    const checkUserFavorite = (productId: string) => {
      const existingFavorite: FavoriteType | undefined = favorite.find(
        (item: FavoriteType) => item.productId === productId
      );
      if (existingFavorite !== undefined) {
        setExistingFavorite(true);
        setExistingFavoriteId(existingFavorite.id);
      }
    };
    if (currentUser && productId) {
      checkUserFavorite(productId);
    } else {
      setExistingFavorite(false);
    }
  }, [currentUser, productId, favorite]);

  // Go to seller's product list
  const goToSellerProductList = (sellerId: string) => {
    navigate(`/products/seller/${sellerId}`);
  };

  // Add a product to favorites in DB
  async function addFavoriteInDb(favorite: NewFavorite) {
    try {
      await addDoc(collection(db, "favorite"), favorite);

      const productRef = doc(collection(db, "product"), productId);
      const docSnap = await getDoc(productRef);
      const product = docSnap.data();
      if (product) {
        const currentLike = parseInt(product.likeCount);

        await updateDoc(productRef, { likeCount: currentLike + 1 });

        setModalMsg("successfully added favorite!");
        setOpenModal(true);
        setExistingFavorite(true);
        console.log("successfully added favorite.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Remove a product from favorites in DB
  async function deleteFavoriteInDb(id: string) {
    try {
      const docRef = doc(db, "favorite", id);
      await deleteDoc(docRef);

      const productRef = doc(collection(db, "product"), productId);
      const docSnap = await getDoc(productRef);
      const product = docSnap.data();
      if (product) {
        const currentLike = parseInt(product.likeCount);

        await updateDoc(productRef, { likeCount: currentLike - 1 });

        setExistingFavorite(false);
        setModalMsg("successfully deleted favorite!");
        setOpenModal(true);
        console.log("successfully deleted favorite.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Send favorite to DB
  const addToFavorites = () => {
    if (!currentUser) {
      setModalMsg("Please login first");
      setOpenModal(true);
      return;
    }
    if (product && currentUser.id === product.seller) {
      setModalMsg("This is your product. You can't add favorite.");
      setOpenModal(true);
      return;
    }
    if (product && productId) {
      const favorite: NewFavorite = {
        city: product.city,
        district: product.district,
        imgURL: product.imgURL,
        isSold: product.isSold,
        price: product.price,
        title: product.title,
        userId: currentUser.id,
        productId: productId,
      };
      if (existingFavorite) {
        deleteFavoriteInDb(existingFavoriteId);
      } else {
        addFavoriteInDb(favorite);
      }
    }
  };

  // Add the selected product to user's cart
  const addProductToCart = () => {
    dispatch(cartActions.addToCart({ ...product, id: productId }));
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
                onClick={addToFavorites}
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

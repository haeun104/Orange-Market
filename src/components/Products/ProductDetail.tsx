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
} from "firebase/firestore";
import { db } from "../../firebase-config";
import Modal from "../Modal";
import { getFormattedDate } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteData } from "../../store/favorite-slice";

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [sellerName, setSellerName] = useState("");
  const [existingFavorite, setExistingFavorite] = useState(false);
  const [existingFavoriteId, setExistingFavoriteId] = useState("");
  const [existingRequest, setExistingRequest] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const productId = useParams();
  const favorite = useSelector((state) => state.favorite.favoriteItem);
  const dispatch = useDispatch();
  const { currentUser } = useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProductData(productId.id);
  }, [productId]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFavoriteData(currentUser.id));
    }
  }, [existingFavorite, currentUser, dispatch]);

  // Fetch product and seller data from DB
  async function fetchProductData(id) {
    try {
      const productRef = doc(db, "product", id);
      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        setProduct(productData);

        const sellerId = productData.seller;
        const userRef = doc(db, "user", sellerId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setSellerName(userData.nickname);
        } else {
          console.log("There is no seller data");
        }
      } else {
        console.log("There is no product data");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Check if favorite exists in DB
  useEffect(() => {
    const checkUserFavorite = (productId) => {
      const existingFavorite = favorite.find(
        (item) => item.productId === productId
      );
      if (existingFavorite) {
        setExistingFavorite(true);
        setExistingFavoriteId(existingFavorite.id);
      }
    };
    if (currentUser && productId) {
      checkUserFavorite(productId.id);
      checkUserRequest(productId.id);
    } else {
      setExistingFavorite(false);
      setExistingRequest(false);
    }
  }, [currentUser, productId, favorite]);

  // Check if the product already exists on the request list
  async function checkUserRequest(productId: string) {
    try {
      const requestQuery = query(
        collection(db, "purchase request"),
        where("product", "==", productId)
      );
      const requestSnapshot = await getDocs(requestQuery);
      if (!requestSnapshot.empty) {
        setExistingRequest(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Go to seller's product list
  const goToSellerProductList = (sellerId) => {
    navigate(`/products/seller/${sellerId}`);
  };

  // Add a product to favorites in DB
  async function addFavoriteInDb(favorite) {
    try {
      await addDoc(collection(db, "favorite"), favorite);
      setModalMsg("successfully added favorite!");
      setOpenModal(true);
      setExistingFavorite(true);
      console.log("successfully added favorite.");
    } catch (error) {
      console.error(error);
    }
  }

  // Remove a product from favorites in DB
  async function deleteFavoriteInDb(id) {
    try {
      const docRef = doc(db, "favorite", id);
      await deleteDoc(docRef);
      setExistingFavorite(false);
      setModalMsg("successfully deleted favorite!");
      setOpenModal(true);
      console.log("successfully deleted favorite.");
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
    const favorite = {
      city: product.city,
      district: product.district,
      imgURL: product.imgURL,
      isSold: product.isSold,
      price: product.price,
      title: product.title,
      userId: currentUser.id,
      productId: productId.id,
    };
    if (existingFavorite) {
      deleteFavoriteInDb(existingFavoriteId);
    } else {
      addFavoriteInDb(favorite);
    }
  };

  // Create a purchase request in DB
  async function createPurchaseRequestInDb(request) {
    try {
      await addDoc(collection(db, "purchase request"), request);
      setModalMsg("successfully send a purchase request!");
      setOpenModal(true);
      setExistingRequest(true);
      console.log("successfully created a purchase request.");
    } catch (error) {
      console.error(error);
    }
  }
  // Send a purchase request to DB
  const sendPurchaseRequest = () => {
    if (!currentUser) {
      setModalMsg("Please login first");
      setOpenModal(true);
      return;
    }
    const request = {
      imgURL: product.imgURL,
      price: product.price,
      title: product.title,
      product: productId.id,
      requestor: currentUser.id,
      requestorName: currentUser.nickname,
      seller: product.seller,
      sellerName: product.sellerName,
      isClosed: false,
      isChosenBySeller: false,
      date: getFormattedDate(new Date()),
    };
    createPurchaseRequestInDb(request);
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
                disabled={product.isSold || existingRequest ? true : false}
                onClick={sendPurchaseRequest}
              >
                {existingRequest
                  ? "waiting for response on purchase request"
                  : "Make a purchase request"}
              </button>
            </div>
          </div>
        </div>
        <Modal
          openModal={openModal}
          setOpenModal={setOpenModal}
          message={modalMsg}
          type={currentUser ? "goback" : "error"}
        />
      </>
    );
  }
};

export default ProductDetail;

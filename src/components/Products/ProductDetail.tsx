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
  Firestore,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Modal from "../modals/Modal";
import { getFormattedDate } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteData } from "../../store/favorite-slice";
import Button from "../Button";
import Loader from "../Loader";
import { AppDispatch, RootState } from "../../store";
import { FavoriteType, ProductType, RequestType } from "../../types/index";
import { fetchProductDetails } from "../../firebase/firebase-action";

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

interface NewRequest {
  closeDate: string;
  date: string;
  imgURL: string;
  isChosenBySeller: boolean;
  isClosed: boolean;
  price: string;
  product: string;
  requestor: string;
  requestorName: string;
  seller: string;
  sellerName: string;
  title: string;
}

const ProductDetail = () => {
  const [product, setProduct] = useState<ProductType>();
  const [existingFavorite, setExistingFavorite] = useState(false);
  const [existingFavoriteId, setExistingFavoriteId] = useState("");
  const [existingRequest, setExistingRequest] = useState(false);
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
      };
      productDetail();
    }
  }, [productId]);

  // Add click count in DB when user open product details
  useEffect(() => {
    const increaseClickCount = async (
      db: Firestore,
      productId: string | undefined
    ) => {
      if (productId !== undefined) {
        try {
          const productRef = doc(db, "product", productId);
          const productSnap = await getDoc(productRef);
          const product = productSnap.data();
          if (product !== undefined) {
            const currentClick = parseInt(product.clickCount);
            await updateDoc(productRef, { clickCount: currentClick + 1 });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    increaseClickCount(db, productId);
  }, [productId]);

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
      checkUserRequest(productId);
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
        const requests: RequestType[] = [];
        requestSnapshot.forEach((doc) =>
          requests.push(doc.data() as RequestType)
        );
        const closedRequest = requests.find(
          (item) => item.isClosed && item.isChosenBySeller
        );
        const pendingRequest = requests.find(
          (item) => !item.isClosed && !item.isChosenBySeller
        );
        if (closedRequest) {
          setRequestBtn("Request is unavailable");
          setExistingRequest(true);
        } else if (pendingRequest) {
          setRequestBtn("Waiting for response on purchase request");
          setExistingRequest(true);
        } else {
          setExistingRequest(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  // Create a purchase request in DB
  async function createPurchaseRequestInDb(request: NewRequest) {
    try {
      await addDoc(collection(db, "purchase request"), request);
      setModalMsg("successfully send a purchase request!");
      setOpenModal(true);
      setExistingRequest(true);
      setRequestBtn("Waiting for response on request");
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
    if (product && currentUser.id === product.seller) {
      setModalMsg("This is your product. Request is not available.");
      setOpenModal(true);
      return;
    }
    if (product && productId && product.sellerName) {
      const request: NewRequest = {
        imgURL: product.imgURL,
        price: product.price,
        title: product.title,
        product: productId,
        requestor: currentUser.id,
        requestorName: currentUser.nickname,
        seller: product.seller,
        sellerName: product.sellerName,
        isClosed: false,
        isChosenBySeller: false,
        closeDate: "",
        date: getFormattedDate(new Date()),
      };
      createPurchaseRequestInDb(request);
    }
  };

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
                    ? "Remove from my favorite list"
                    : "Add to your favorite list"
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
                title={existingRequest ? requestBtn : "Make a purchase request"}
                onClick={sendPurchaseRequest}
                btnColor="purple"
                disabled={product.isSold || existingRequest ? true : false}
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

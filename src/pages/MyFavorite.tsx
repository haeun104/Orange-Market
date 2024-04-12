import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MyMarketMenu from "../components/myMarket/MyMarketMenu";
import Button from "../components/Button";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useCallback, useContext, useEffect, useState } from "react";
import Modal from "../components/modals/Modal";
import Loader from "../components/Loader";
import { FavoriteType } from "../types";
import { AppDispatch, RootState } from "../store";
import {} from "react-redux";
import { fetchFavoriteData } from "../store/favorite-slice";
import { DataContext } from "../App";

const MyFavorite = () => {
  const [openModal, setOpenModal] = useState(false);
  const favoriteList = useSelector(
    (state: RootState) => state.favorite.favoriteItem
  );
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const currentUser = useContext(DataContext);

  const updateFavorites = useCallback(() => {
    if (currentUser) {
      dispatch(fetchFavoriteData(currentUser.id));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    updateFavorites();
  }, [updateFavorites]);

  const goToProductDetail = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  // Remove a product from favorites in DB
  async function deleteFavoriteInDb(id: string, productId: string) {
    try {
      const docRef = doc(db, "favorite", id);
      await deleteDoc(docRef);

      const productRef = doc(collection(db, "product"), productId);
      const docSnap = await getDoc(productRef);
      const product = docSnap.data();
      if (product) {
        const currentLike = parseInt(product.likeCount);

        await updateDoc(productRef, { likeCount: currentLike - 1 });

        setOpenModal(true);
        console.log("successfully deleted favorite.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (!favoriteList) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="container max-w-[1280px] px-[40px]">
          <MyMarketMenu />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-[20px]">
            {favoriteList.map((item: FavoriteType) => (
              <div key={item.id}>
                <div className="h-[200px] w-[250px] lg:w-full">
                  <img
                    src={item.imgURL}
                    alt={item.title}
                    className="h-full w-full rounded-lg"
                  />
                </div>
                <div
                  className="flex flex-col text-gray-400 cursor-pointer"
                  onClick={() => goToProductDetail(item.productId)}
                >
                  <h4 className="text-black font-bold">{item.title}</h4>
                  <span className="text-black font-bold">{item.price} PLN</span>
                  <span>{`${item.city}, ${item.district}`}</span>
                  <span>{item.isSold ? "Sold" : "On sale"}</span>
                </div>
                <Button
                  title="Delete"
                  onClick={() => deleteFavoriteInDb(item.id, item.productId)}
                  btnColor="orange"
                  style="mt-[10px]"
                />
              </div>
            ))}
          </div>
          {favoriteList.length === 0 && (
            <div className="text-center">
              There are no products added to favorites
            </div>
          )}
        </div>
        <Modal
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          message="successfully deleted favorite!"
          updateProductList={updateFavorites}
          type="favorite"
        />
      </>
    );
  }
};

export default MyFavorite;

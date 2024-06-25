import { useNavigate } from "react-router-dom";
import MyMarketMenu from "../components/myMarket/MyMarketMenu";
import Button from "../components/Button";
import { useContext, useEffect, useState } from "react";
import Modal from "../components/modals/Modal";
import Loader from "../components/Loader";
import { ProductType } from "../types/index";
import { DataContext } from "../App";
import { deleteFavorites, fetchFavorites } from "../firebase/firebase-action";

const MyFavorite = () => {
  const [openModal, setOpenModal] = useState(false);
  const [favoriteList, setFavoriteList] = useState<ProductType[]>();

  const navigate = useNavigate();

  const currentUser = useContext(DataContext);

  // Fetch products list from user's favorites
  useEffect(() => {
    if (currentUser) {
      const updateFavoriteList = async () => {
        const favorites = await fetchFavorites(currentUser.id);
        setFavoriteList(favorites as ProductType[]);
      };
      updateFavoriteList();
    }
  }, [currentUser]);

  // Remove a product from favorites in DB
  async function handleDeleteFavorites(userId: string, itemId: string) {
    try {
      await deleteFavorites(userId, itemId);
      setOpenModal(true);
      const updatedFavorites = await fetchFavorites(userId);
      setFavoriteList(updatedFavorites as ProductType[]);
    } catch (error) {
      console.error(error);
    }
  }

  const goToProductDetail = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  if (!favoriteList || !currentUser) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="container max-w-[1280px] px-[40px]">
          <MyMarketMenu />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-[20px]">
            {favoriteList.map((item) => (
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
                  onClick={() => goToProductDetail(item.id)}
                >
                  <h4 className="text-black font-bold">{item.title}</h4>
                  <span className="text-black font-bold">{item.price} PLN</span>
                  <span>{`${item.city}, ${item.district}`}</span>
                  <span>{item.isSold ? "Sold" : "On sale"}</span>
                </div>
                <Button
                  title="Delete"
                  onClick={() => handleDeleteFavorites(currentUser.id, item.id)}
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
          type="favorite"
        />
      </>
    );
  }
};

export default MyFavorite;

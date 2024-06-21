import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../App";
import { productFilterCategories } from "./../utils";
import Modal from "../components/modals/Modal";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { IoMdAddCircle } from "react-icons/io";
import Loader from "../components/Loader";
import { ProductType } from "../types";
import queryString from "query-string";
import {
  addClickCount,
  fetchOnSalesProducts,
} from "../firebase/firebase-action";

interface ProductsFromDB extends ProductType {
  id: string;
}

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState<ProductsFromDB[]>(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const currentUser = useContext(DataContext);

  // Fetch products from the selected category by using query string
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "product"), async () => {
      const selectedCategory =
        queryString.parse(searchParams.toString()).sort || "All";
      const city = currentUser && currentUser.city;
      const products = await fetchOnSalesProducts(selectedCategory, city);
      setFilteredProducts(products as ProductsFromDB[]);
    });

    return () => unsubscribe();
  }, [searchParams, currentUser]);

  // Go to the product register page
  const goToNewProductPage = () => {
    if (!currentUser) {
      setOpenModal(true);
      return;
    }
    navigate("/products/new");
  };

  // Go to product details
  const goToProductDetailPage = (id: string) => {
    addClickCount(id);
    navigate(`/products/${id}`);
  };

  // Update state as per a selected category
  const handleCategoryClick = (category: string) => {
    if (category === "My Location" && !currentUser) {
      setOpenModal(true);
    }
    const url = queryString.stringifyUrl({
      url: "/products",
      query: { sort: category },
    });

    navigate(url);
  };

  // Go to my profile
  const goToMyProfile = () => {
    navigate("/my-profile");
  };

  if (!filteredProducts) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="container max-w-[1280px] relative py-[40px]">
          <h2 className="text-lg font-bold text-center mb-8">PRODUCT LIST</h2>
          <div className="max-w-[640px] mx-auto mb-[40px]">
            <ul className="flex space-x-4 flex-wrap justify-center mx-[20px]">
              {productFilterCategories.map((item, index) => (
                <li
                  key={index}
                  className={`cursor-pointer border-b-white border-solid border-b-2 hover:border-black ${
                    searchParams.get("sort") === item.value &&
                    "font-bold border-b-black"
                  }`}
                  onClick={() => handleCategoryClick(item.value)}
                >
                  {item.value}
                </li>
              ))}
            </ul>
          </div>
          {searchParams.get("sort") === "My Location" &&
            currentUser &&
            currentUser.city === "" && (
              <div className="text-center">
                <div className="mb-[10px]">
                  Update your address in My Profile first
                </div>
                <button className="btn-purple" onClick={goToMyProfile}>
                  Go to My Profile
                </button>
              </div>
            )}
          {filteredProducts.length === 0 &&
          searchParams.get("sort") !== "My Location" ? (
            <div className="text-center">
              <div className="mb-[10px]">
                There is no product registered yet
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 lg:px-[150px]">
              {filteredProducts.map((item: ProductsFromDB) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-center mx-auto w-[250px] cursor-pointer"
                  onClick={() => goToProductDetailPage(item.id)}
                >
                  <div className="h-[200px]">
                    <img
                      src={item.imgURL}
                      alt={item.title}
                      className="h-full w-full rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col text-gray-400">
                    <h4 className="text-black">{item.title}</h4>
                    <span className="text-black">{item.price} PLN</span>
                    <span>{`${item.city}, ${item.district}`}</span>
                    <div className="flex space-x-2 text-sm">
                      <span>Click {item.clickCount}</span>
                      <span>Like {item.likeCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className="absolute top-[10px] right-[5px] md:top-0 md:right-[40px] text-center cursor-pointer"
            onClick={goToNewProductPage}
          >
            <IoMdAddCircle
              size={32}
              className="text-main-orange hover:opacity-80 mx-auto"
            />
            <div className="text-main-orange font-bold text-[12px] sm:text-[16px] text-center">
              Register <br />
              your product!
            </div>
          </div>
        </div>
        <Modal
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          resetCategory={() => navigate("/products")}
          message="Please login first"
          type="unauthorized"
        />
      </>
    );
  }
};

export default Products;

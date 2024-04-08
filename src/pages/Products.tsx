import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../App";
import { productFilterCategories } from "./../utils";
import { ProductType } from "../App";
import Modal from "../components/Modal";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { IoMdAddCircle } from "react-icons/io";
import Loader from "../components/Loader";

interface ProductsFromDB extends ProductType {
  id: string;
}

const Products = () => {
  const [category, setCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState<ProductsFromDB[]>();
  const [products, setProducts] = useState<ProductsFromDB[]>();
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useContext(DataContext);

  //Fetch product data from DB
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "product"), (snapshot) => {
      const productList: ProductsFromDB[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as ProductsFromDB;
        productList.push({
          ...data,
          id: doc.id,
        });
      });
      const unsoldProducts = productList.filter((item) => !item.isSold);
      setProducts(unsoldProducts);
    });
    return () => unsubscribe();
  }, []);

  // Filter a product list as per a selected category
  useEffect(() => {
    setMessage("There is no product registered yet.");
    if (category === "All") {
      setFilteredProducts(products);
    } else if (category === "My Location") {
      if (!currentUser) {
        setOpenModal(true);
      } else {
        const isExistingAddress = currentUser.city;
        if (products !== undefined) {
          const userLocationProduct = products.filter(
            (item: ProductType) =>
              item.city.toLowerCase() === currentUser.city.toLowerCase()
          );
          if (!isExistingAddress) {
            setMessage("Update your address in My Profile first");
          }
          setFilteredProducts(userLocationProduct);
        }
      }
    } else {
      if (products !== undefined) {
        const filteredProducts = products.filter(
          (item: ProductType) => item.category === category
        );
        setFilteredProducts(filteredProducts);
      }
    }
  }, [category, products, currentUser]);

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
    navigate(`/products/${id}`);
  };

  // Update state as per a selected category
  const handleCategoryClick = (category: string) => {
    setCategory(category);
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
                  className={`cursor-pointer ${
                    category === item.value && "font-bold border-black"
                  } border-white border-solid border-b-[2px] hover:border-black active:border-black`}
                  onClick={() => handleCategoryClick(item.value)}
                >
                  {item.value}
                </li>
              ))}
            </ul>
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center">
              <div className="mb-[10px]">{message}</div>
              {message === "Update your address in My Profile first" && (
                <button className="btn-purple" onClick={goToMyProfile}>
                  Go to My Profile
                </button>
              )}
            </div>
          )}
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
          setOpenModal={setOpenModal}
          setCategory={setCategory}
          message="Please login first"
          type="login"
        />
      </>
    );
  }
};

export default Products;

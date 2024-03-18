import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../App";
import { productFilterCategories } from "./../utils";
import { ProductType } from "../App";
import Modal from "../components/Modal";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";

interface ProductList {
  [key: string]: string | number | boolean;
}

const Products = () => {
  const [category, setCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState();
  const [products, setProducts] = useState();
  const [emptyProducts, setEmptyProducts] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useContext(DataContext);

  //Fetch product data from DB
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "product"), (snapshot) => {
      const productList: ProductType[] = [];
      snapshot.docs.forEach((doc) => {
        productList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setProducts(productList);
    });
    return () => unsubscribe();
  }, []);

  // Filter a product list as per a selected category
  useEffect(() => {
    setEmptyProducts(false);
    if (category === "All") {
      setFilteredProducts(products);
    } else if (category === "My Location") {
      if (!currentUser) {
        setOpenModal(true);
      } else {
        const userLocationProduct = products.filter(
          (item: ProductList) => item.city === currentUser.city
        );
        if (userLocationProduct.length === 0) {
          setEmptyProducts(true);
        }
        setFilteredProducts(userLocationProduct);
      }
    } else {
      const filteredProducts = products.filter(
        (item: ProductType) => item.category === category
      );
      if (filteredProducts.length === 0) {
        setEmptyProducts(true);
      }
      setFilteredProducts(filteredProducts);
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

  if (!filteredProducts) {
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
              There is no product registered yet.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 lg:px-[150px]">
            {filteredProducts.map((item: ProductType) => (
              <div
                key={item.id}
                className="flex flex-col justify-center mx-auto w-[250px] cursor-pointer"
                onClick={() => goToProductDetailPage(item.id)}
              >
                <div className="">
                  <img src={item.imgURL} alt={item.title} />
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
          <div className="absolute top-0 right-[5px] md:top-0 md:right-[40px] text-center">
            <button
              className="bg-main-orange hover:opacity-80 text-white font-bold rounded-[50%] w-[30px] h-[30px] text-[16px] md:w-[40px] md:h-[40px] md:text-[24px]"
              onClick={goToNewProductPage}
            >
              +
            </button>
            <div className="text-main-orange font-bold text-sm text-center">
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

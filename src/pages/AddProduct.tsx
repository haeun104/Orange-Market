import { useContext, useEffect, useState } from "react";
import { DataContext } from "../App";
import { getFormattedDate } from "../../src/utils";
import { db, uploadImageToDb } from "../../src/firebase-config";
import { addDoc, collection } from "firebase/firestore";
import Modal from "../components/Modal";

const categories = [
  { value: "Electronics", label: "Electronics" },
  { value: "Furniture", label: "Furniture" },
  { value: "Clothing", label: "Clothing" },
  { value: "Accessories", label: "Accessories" },
  { value: "Vehicle", label: "Vehicle" },
  { value: "Sports", label: "Sports" },
  { value: "Books", label: "Books" },
  { value: "Kids", label: "Kids" },
  { value: "Beauty", label: "Beauty" },
  { value: "Health", label: "Health" },
  { value: "Groceries", label: "Groceries" },
];

const AddProduct = () => {
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: 0,
    category: "Electronics",
    date: getFormattedDate(new Date()),
    clickCount: 0,
    likeCount: 0,
    seller: "",
    buyer: "",
    isSold: false,
  });

  //   const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const { loggedInUserData } = useContext(DataContext);

  useEffect(() => {
    if (loggedInUserData !== undefined) {
      setNewProduct((prev) => ({
        ...prev,
        seller: loggedInUserData.nickname,
      }));
    }
  }, []);

  // Update input value
  const handleOnChangeNewProduct = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Update image value
  const handleOnChangeImage = (e) => {
    const file = e.target.files[0];
    // setImageFile(file);
    setImageName(file.name);
  };

  // Create a new product in DB
  async function createProductInDb(product) {
    try {
      await addDoc(collection(db, "product"), product);
      console.log("successfully created a product.");
      setOpenModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  // Send product data to DB
  const handleSubmitNewProduct = (e) => {
    e.preventDefault();
    createProductInDb(newProduct);
    uploadImageToDb(imageName);
  };

  if (!loggedInUserData) {
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
        <div className="container px-5 py-10">
          <h2 className="text-center text-lg text-main-orange font-bold">
            Register your product
          </h2>
          <form
            className="flex flex-col space-y-2 max-w-[500px] mx-auto"
            onSubmit={(e) => handleSubmitNewProduct(e)}
          >
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              max="100"
              className="basic-input"
              placeholder="Enter a title of your product"
              name="title"
              onChange={(e) => handleOnChangeNewProduct(e)}
              value={newProduct.title}
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="border-solid border-gray-200 border-2 rounded-md"
              rows={5}
              placeholder="Describe your product (color, size, used period, whatever you want to share with a future buyer)"
              name="description"
              onChange={(e) => handleOnChangeNewProduct(e)}
              value={newProduct.description}
              required
            />

            <label htmlFor="price">Price (Polish zloty, PLN)</label>
            <input
              type="number"
              id="price"
              className="basic-input"
              name="price"
              onChange={(e) => handleOnChangeNewProduct(e)}
              value={newProduct.price}
              required
            />

            <label htmlFor="image">Image file</label>
            <input
              type="file"
              id="image"
              className="cursor-pointer w-1/2"
              onChange={(e) => handleOnChangeImage(e)}
            />

            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              className="border-solid border-2 border-gray-200 h-8 rounded-md"
              onChange={(e) => handleOnChangeNewProduct(e)}
              value={newProduct.category}
              required
            >
              {categories.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
            <button className="btn-purple w-1/2 self-center">Save</button>
          </form>
        </div>
        <Modal
          openModal={openModal}
          setOpenModal={setOpenModal}
          message={"successfully registered a product!"}
        />
      </>
    );
  }
};

export default AddProduct;

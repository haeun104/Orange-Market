import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import { getFormattedDate, productRegisterCategories } from "../../utils";
import { db, storage } from "../../firebase-config";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import Modal from "../../components/Modal";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";

const initialProduct = {
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
  imgURL: "",
  city: "",
  district: "",
};

const ProductForm = ({ type }) => {
  const [product, setProduct] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [imageName, setImageName] = useState(null);
  const { productId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useContext(DataContext);

  // Update state whenever a current user is changed
  useEffect(() => {
    if (type === "new" && currentUser) {
      setProduct((prev) => ({
        ...prev,
        seller: currentUser.id,
        sellerName: currentUser.nickname,
      }));
    }
  }, [currentUser, type]);

  // Fetch product data from DB
  const fetchProductData = async (productId) => {
    try {
      const productRef = doc(db, "product", productId);
      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        setProduct(productData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (productId && type === "edit") {
      fetchProductData(productId);
    }
    if (type === "new") {
      setProduct(initialProduct);
    }
  }, [type, productId]);

  // Update product data changes in DB
  async function updateProduct(newData, id) {
    try {
      const docRef = doc(collection(db, "product"), id);

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.log("No such product");
        return;
      }

      const currentData = docSnap.data();
      const updatedData = { ...currentData, ...newData };

      const diff = Object.keys(updatedData).reduce((result, key) => {
        if (currentData[key] !== updatedData[key]) {
          result[key] = updatedData[key];
        }
        return result;
      }, {});
      console.log(diff);

      await updateDoc(docRef, diff);
      setOpenModal(true);
      console.log("successfully updated product data.");
    } catch (error) {
      console.error(error);
    }
  }

  // Create a new product in DB
  async function createProduct(product) {
    try {
      await addDoc(collection(db, "product"), product);
      console.log("successfully created a product.");
      setOpenModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  // Upload image into DB
  const updateImageAndProduct = async (file, seller) => {
    try {
      const uploadFile = await uploadBytes(
        ref(storage, `images/${seller}_${file.name}`),
        file
      );
      const fileURL = await getDownloadURL(uploadFile.ref);
      console.log(fileURL);
      if (type === "edit") {
        updateProduct({ ...product, imgURL: fileURL }, productId);
      } else {
        createProduct({ ...product, imgURL: fileURL });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    updateImageAndProduct(imageName, currentUser.id);
  };

  // Update image value
  const handleOnChangeImage = (e) => {
    const file = e.target.files[0];
    setImageName(file);
  };

  // Update input value
  const handleOnChangeProduct = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Go back
  const handleCancelClick = () => {
    navigate(-1);
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
        <form
          className="flex flex-col space-y-2 max-w-[500px] mx-auto"
          onSubmit={(e) => handleOnSubmit(e)}
        >
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            max="100"
            className="basic-input"
            placeholder="Enter a title of your product"
            name="title"
            required
            value={product.title}
            onChange={(e) => handleOnChangeProduct(e)}
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="border-solid border-gray-200 border-2 rounded-md focus:border-main-orange indent-[6px]"
            rows={5}
            placeholder="Describe your product (color, size, used period, whatever you want to share with a future buyer)"
            name="description"
            required
            value={product.description}
            onChange={(e) => handleOnChangeProduct(e)}
          />

          <label htmlFor="price">Price (Polish zloty, PLN)</label>
          <input
            type="number"
            id="price"
            className="basic-input"
            name="price"
            required
            value={product.price}
            onChange={(e) => handleOnChangeProduct(e)}
          />
          <div className="flex flex-col space-y-2">
            <span className="">Selling Location</span>

            <label htmlFor="city flex flex-col">City</label>
            <input
              type="text"
              id="city"
              className="basic-input"
              name="city"
              required
              value={product.city}
              onChange={(e) => handleOnChangeProduct(e)}
            />

            <label htmlFor="district">District</label>
            <input
              type="text"
              id="district"
              className="basic-input"
              name="district"
              required
              value={product.district}
              onChange={(e) => handleOnChangeProduct(e)}
            />
          </div>

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
            required
            value={product.category}
            onChange={(e) => handleOnChangeProduct(e)}
          >
            {productRegisterCategories.map((item, index) => (
              <option key={index} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
          <div className="flex pt-3 justify-between space-x-4">
            <button className="btn-purple flex-1">
              {type === "edit" ? "Edit" : "Submit"}
            </button>
            <button
              type="button"
              className="btn-orange flex-1"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </form>
        <Modal
          openModal={openModal}
          setOpenModal={setOpenModal}
          message={
            type === "edit"
              ? "successfully updated a product!"
              : "successfully registered a product!"
          }
        />
      </>
    );
  }
};

export default ProductForm;

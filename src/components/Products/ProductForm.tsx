import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import { getFormattedDate, productRegisterCategories } from "../../utils";
import { db, storage } from "../../firebase/firebase-config";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import Modal from "../modals/Modal";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { ProductType } from "../../types";
import Loader from "../Loader";
import Input from "../inputs/Input";
import Button from "../Button";

const initialProduct: ProductType = {
  title: "",
  description: "",
  price: "",
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

interface UpdatedProduct {
  title: string;
  description: string;
  price: string;
  category: string;
  imgURL: string;
  city: string;
  district: string;
}

interface FormType {
  type: string;
}

const ProductForm: React.FC<FormType> = ({ type }) => {
  const [product, setProduct] = useState<ProductType>();
  const [openModal, setOpenModal] = useState(false);
  const [imageName, setImageName] = useState<File | string>();
  const [tempImage, setTempImage] = useState("");
  const { productId } = useParams();

  const navigate = useNavigate();
  const currentUser = useContext(DataContext);

  // Update state whenever a current user is changed
  useEffect(() => {
    if (type === "new" && currentUser) {
      setProduct(
        (prev) =>
          ({
            ...prev,
            seller: currentUser.id,
            sellerName: currentUser.nickname,
          } as ProductType)
      );
    }
  }, [currentUser, type]);

  // Fetch product data from DB
  const fetchProductData = async (productId: string) => {
    try {
      const productRef = doc(db, "product", productId);
      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data() as ProductType;
        setProduct(productData);
        setTempImage(productData.imgURL);
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
  async function updateProduct(newData: UpdatedProduct, id: string) {
    try {
      const docRef = doc(collection(db, "product"), id);

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.log("No such product");
        return;
      }

      const currentData = docSnap.data();
      const updatedData = { ...currentData, ...newData };

      const diff = Object.keys(updatedData).reduce(
        (result: Partial<UpdatedProduct>, key) => {
          if (currentData[key] !== updatedData[key as keyof UpdatedProduct]) {
            result[key as keyof UpdatedProduct] =
              updatedData[key as keyof UpdatedProduct];
          }
          return result;
        },
        {}
      );
      await updateDoc(docRef, diff);
      setOpenModal(true);
      console.log("successfully updated product data.");
    } catch (error) {
      console.error(error);
    }
  }

  // Create a new product in DB
  async function createProduct(product: ProductType) {
    try {
      await addDoc(collection(db, "product"), product);
      console.log("successfully created a product.");
      setOpenModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  // Upload image into DB
  const uploadImageAndReturnURL = async (file: File, seller: string) => {
    const uploadFile = await uploadBytes(
      ref(storage, `images/${seller}_${file.name}`),
      file
    );
    return await getDownloadURL(uploadFile.ref);
  };

  const updateImageAndProduct = async (file: File | string, seller: string) => {
    try {
      if (typeof file !== "string") {
        const fileURL = await uploadImageAndReturnURL(file, seller);
        const isDataExisting = fileURL && product;
        if (isDataExisting && type === "new") {
          createProduct({ ...product, imgURL: fileURL });
        }
        if (isDataExisting && productId && type === "edit") {
          updateProduct({ ...product, imgURL: fileURL }, productId);
        }
      } else {
        if (product && productId && type === "edit") {
          updateProduct({ ...product }, productId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnSubmit = () => {
    if (imageName && currentUser) {
      updateImageAndProduct(imageName, currentUser.id);
    }
    if (!imageName && currentUser && type === "edit") {
      updateImageAndProduct(tempImage, currentUser.id);
    }
  };

  // Update image value
  const handleOnChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file !== null) {
        setImageName(file);
      }
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setTempImage(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Update input value
  const handleOnChangeProduct = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProduct(
      (prev) =>
        ({
          ...prev,
          [e.target.name]: e.target.value,
        } as ProductType)
    );
  };

  // Go back
  const handleCancelClick = () => {
    navigate(-1);
  };

  if (!product) {
    return <Loader />;
  } else {
    return (
      <>
        <form className="flex flex-col space-y-2 max-w-[500px] mx-auto">
          <Input
            type="text"
            id="title"
            max="100"
            className="basic-input"
            placeholder="Enter a title of your product"
            required
            value={product.title}
            onChange={handleOnChangeProduct}
            label="Title"
          />
          <Input
            id="description"
            className="border-solid border-gray-200 border-2 rounded-md focus:border-main-orange indent-[6px]"
            rows={5}
            placeholder="Describe your product (color, size, used period, whatever you want to share with a future buyer)"
            required
            value={product.description}
            onChange={handleOnChangeProduct}
            label="Description"
            textarea={true}
          />
          <Input
            label="Price (Polish zloty, PLN)"
            type="number"
            id="price"
            className="basic-input"
            required
            value={product.price}
            onChange={handleOnChangeProduct}
          />
          <div className="flex flex-col space-y-2">
            <span className="">Selling Location</span>
            <Input
              type="text"
              id="city"
              className="basic-input"
              required
              value={product.city}
              onChange={handleOnChangeProduct}
              label="City"
            />
            <Input
              type="text"
              id="district"
              className="basic-input"
              required
              value={product.district}
              onChange={handleOnChangeProduct}
              label="District"
            />
          </div>
          <div>
            <span>Image File</span>
            <div className="flex flex-row mt-[5px] gap-4">
              <div className="h-[100px] w-[100px] border-[1px] border-accent-grey border-solid rounded-md flex items-center justify-center text-center text-sm">
                {tempImage ? (
                  <img
                    src={tempImage}
                    alt="product image"
                    className="rounded-md h-full w-full"
                  />
                ) : (
                  "No image chosen"
                )}
              </div>
              <label htmlFor="image" className="relative">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={(e) => handleOnChangeImage(e)}
                  required={type === "new" ? true : false}
                />
                <div className="w-[100px] text-center p-[5px] rounded-md bg-main-orange hover:opacity-80 text-sm text-white absolute top-0 left-0 ">
                  Choose File
                </div>
              </label>
            </div>
          </div>

          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            className="border-solid border-2 border-gray-200 h-8 rounded-md"
            required
            value={product.category}
            onChange={handleOnChangeProduct}
          >
            {productRegisterCategories.map((item, index) => (
              <option key={index} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
          <div className="flex pt-3 justify-between space-x-4">
            <Button
              onClick={handleOnSubmit}
              btnColor="purple"
              title={type === "edit" ? "Edit" : "Submit"}
            />
            <Button
              onClick={handleCancelClick}
              btnColor="grey"
              title="Cancel"
            />
          </div>
        </form>
        <Modal
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          message={
            type === "edit"
              ? "successfully updated a product!"
              : "successfully registered a product!"
          }
          type={type === "new" ? "goToHome" : "myproducts"}
        />
      </>
    );
  }
};

export default ProductForm;

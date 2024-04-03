import ProductForm from "../components/products/ProductForm";

const EditProduct = () => {
  return (
    <div className="container px-5 py-10">
      <h2 className="text-center text-lg text-main-orange font-bold uppercase mb-[20px]">
        edit your product
      </h2>
      <ProductForm type="edit" />
    </div>
  );
};

export default EditProduct;

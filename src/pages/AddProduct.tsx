import ProductForm from "../components/products/ProductForm";

const AddProduct = () => {
  return (
    <div className="container px-5 py-10">
      <h2 className="text-center text-lg text-main-orange font-bold uppercase mb-[20px]">
        Register your product
      </h2>
      <ProductForm type="new" />
    </div>
  );
};

export default AddProduct;

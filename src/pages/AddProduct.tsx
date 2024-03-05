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
  return (
    <div className="container px-5 py-10">
      <h2 className="text-center text-lg text-main-orange font-bold">
        Sell your product
      </h2>
      <form className="flex flex-col space-y-2 max-w-[500px] mx-auto">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          max="100"
          className="basic-input"
          placeholder="Enter a title of your product"
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="border-solid border-gray-200 border-2 rounded-md"
          rows={5}
          placeholder="Describe your product (color, size, used period, whatever you want to share with a future buyer)"
        />

        <label htmlFor="price">Price (Polish zloty, PLN)</label>
        <input type="number" id="price" className="basic-input" />

        <label htmlFor="image">Image file</label>
        <input type="file" id="image" className="cursor-pointer w-1/2" />

        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          className="border-solid border-2 border-gray-200 h-8 rounded-md"
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
  );
};

export default AddProduct;

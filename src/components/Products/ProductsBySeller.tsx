import { useParams } from "react-router-dom";

const ProductsBySeller = () => {
  const { seller } = useParams();

  return <div>products by {seller}</div>;
};

export default ProductsBySeller;

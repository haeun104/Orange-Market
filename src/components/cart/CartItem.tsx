import { FaMinusCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartActions } from "../../store/cart-slice";

export interface CartItemProps {
  id: string;
  title: string;
  price: string;
  imgURL: string;
  closeCart: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  price,
  imgURL,
  closeCart,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToProductDetails = () => {
    navigate(`/products/${id}`);
    closeCart();
  };

  const removeItem = () => {
    dispatch(cartActions.removeItem(id));
  };

  return (
    <div className="flex items-start justify-between gap-2 p-2 text-sm">
      <div className="w-[50px] h-[50px] rounded-md overflow-hidden">
        <img src={imgURL} alt={title} className="h-full w-full" />
      </div>
      <div className="flex-1">
        <p
          className="font-bold hover:underline cursor-pointer"
          onClick={goToProductDetails}
        >
          {title}
        </p>
        <span>{price} PLN</span>
      </div>
      <div className="pt-1 cursor-pointer" onClick={removeItem}>
        <FaMinusCircle size={18} />
      </div>
    </div>
  );
};

export default CartItem;

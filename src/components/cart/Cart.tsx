import { useContext, useEffect, useRef, useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { CartItems } from "../../store/cart-slice";
import { DataContext } from "../../App";
import Modal from "../modals/Modal";

const Cart = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const currentUser = useContext(DataContext);

  const cartItems: CartItems[] = useSelector(
    (state: RootState) => state.cart.cartItems
  );

  const handleClickOutside = (e: MouseEvent) => {
    if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
      setCartOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrderCreation = () => {
    if (!currentUser) {
      setOpenModal(true);
    }
  };

  return (
    <>
      <div className="sm:px-2">
        <div
          className="relative cursor-pointer"
          onClick={() => setCartOpen(!cartOpen)}
        >
          <TiShoppingCart size={35} color="#C7C8CC" />
          <div className="w-[20px] h-[20px] bg-main-orange rounded-full text-xs text-white flex justify-center items-center font-bold absolute -top-1 -right-2">
            {cartItems.length}
          </div>
        </div>
      </div>
      {cartOpen && (
        <div
          ref={cartRef}
          className="absolute right-0 top-12 z-10 mt-2 w-[250px] rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5"
        >
          {cartItems.length === 0 ? (
            <div className="text-center text-sm text-accent-grey py-2">
              There is no item in your cart
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  imgURL={item.imgURL}
                  closeCart={() => setCartOpen(false)}
                />
              ))}
              <div className="flex justify-end pr-2 py-2">
                <button
                  className="bg-accent-purple text-white px-2 py-1 rounded-md text-sm"
                  onClick={handleOrderCreation}
                >
                  Place an order
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <Modal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        message="Please login first"
      />
    </>
  );
};

export default Cart;

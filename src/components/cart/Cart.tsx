import { useEffect, useRef, useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import CartItem from "./CartItem";

const Cart = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
      setCartOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.addEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="sm:pr-2">
        <div
          className="relative cursor-pointer"
          onClick={() => setCartOpen(!cartOpen)}
        >
          <TiShoppingCart size={35} color="#C7C8CC" />
          <div className="w-[20px] h-[20px] bg-main-orange rounded-full text-xs text-white flex justify-center items-center font-bold absolute -top-1 -right-2">
            0
          </div>
        </div>
      </div>
      {cartOpen && (
        <div
          ref={cartRef}
          className="absolute right-0 top-12 z-10 mt-2 w-[250px] rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <CartItem />
        </div>
      )}
    </>
  );
};

export default Cart;

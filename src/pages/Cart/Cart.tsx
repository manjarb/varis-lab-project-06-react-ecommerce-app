import React, { useMemo } from "react";
import { useCart } from "../../hooks/useCart/useCart";
import CategoryBanner from "../Category/components/CategoryBanner/CategoryBanner";
import CartTable from "../../components/CartTable/CartTable";
import Button from "../../components/Button/Button";
import useProductRoute from "../../hooks/useProductRoute/useProductRoute";

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { goToCheckout } = useProductRoute();

  const calculateTotalPrice = useMemo(() => {
    return cart.items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  }, [cart.items]);

  const onCheckout = () => {
    goToCheckout();
  };

  if (cart.items.length === 0) {
    return (
      <>
        <CategoryBanner name="Cart" />
        <div className="container text-center mt-50 pb-60">
          <h2 className="fs-32 fw-bold mb-40">Your Cart is Empty</h2>
          <p className="text-muted fs-24">
            You haven't added any items to your cart yet.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <CategoryBanner name="Cart" />
      <div className="container pt-30 pb-30">
        <CartTable
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
        <div className="table-total pr-20 pt-20 text-right">
          <h3>Total Price: ${calculateTotalPrice}</h3>
          <div className="inline-block mt-15">
            <Button onClick={onCheckout}>Checkout</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;

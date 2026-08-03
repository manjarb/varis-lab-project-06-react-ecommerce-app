import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import styles from "./CartSummary.module.scss";
import { useCart } from "@/features/cart/useCart";

interface CartSummaryProps {
  onIconClick: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onIconClick }) => {
  const { cart } = useCart();

  const totalItems = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items],
  );

  return (
    <div className="relative" onClick={onIconClick}>
      <FontAwesomeIcon className="pointer fs-20" icon={faCartShopping} />
      {totalItems > 0 && (
        <span
          className={`${styles.cartCount} fs-12 fw-bold text-center`}
          aria-label="Cart item count"
        >
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default CartSummary;

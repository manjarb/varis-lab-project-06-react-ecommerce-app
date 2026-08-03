import React from "react";
import styles from "./SummaryOrder.module.scss";
import { useCart } from "@/features/cart/useCart";
import SummaryOrderItem from "@/features/checkout/components/SummaryOrderItem/SummaryOrderItem";

const SummaryOrder: React.FC = () => {
  const { cart } = useCart();

  return (
    <div className={`${styles.container} p-20`}>
      <h3 className="fs-20 mb-5">Summary Order</h3>
      <p className="fs-14 text-muted mb-15">
        For a better experience, verify your goods and choose your shipping
        option.
      </p>
      <hr className="mb-15" />
      {cart.items.map((item) => (
        <div className="mb-15" key={item.id}>
          <SummaryOrderItem item={item} />
        </div>
      ))}
    </div>
  );
};

export default SummaryOrder;

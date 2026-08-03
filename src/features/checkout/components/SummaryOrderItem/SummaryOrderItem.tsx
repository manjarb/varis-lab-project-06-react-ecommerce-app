import React from "react";
import styles from "./SummaryOrderItem.module.scss";
import { CartItem } from "@/features/cart/store/CartContext";

interface SummaryOrderItemProps {
  item: CartItem;
}

const SummaryOrderItem: React.FC<SummaryOrderItemProps> = ({ item }) => {
  const { title, price, quantity, id, image } = item;

  return (
    <div key={id} className={`flex align-item-center`}>
      <img className={`${styles.image} mr-10`} src={image} alt={title} />
      <div className="flex-grow">
        <p className="fs-16 fw-medium mb-5">{title}</p>
        <p className="fs-14 text-muted">
          ${price.toFixed(2)} X {quantity}
        </p>
      </div>
      <div className="fs-16 fw-bold text-primary">
        ${(price * quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default SummaryOrderItem;

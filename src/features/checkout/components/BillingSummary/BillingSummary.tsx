import React from "react";
import styles from "./BillingSummary.module.scss";
import Button from "@/shared/components/Button/Button";

interface BillingSummaryProps {
  subTotal: number;
  shipping: number;
  total: number;
  isLoading: boolean;
  isDisabled: boolean;
  onPlaceOrder: () => void;
}

const BillingSummary: React.FC<BillingSummaryProps> = ({
  subTotal,
  shipping,
  total,
  isLoading = false,
  isDisabled = false,
  onPlaceOrder,
}) => {
  return (
    <div className={`${styles.container} p-20`}>
      <h3 className="fs-20 fw-bold mb-20">Billing Summary</h3>
      <hr className="mb-20" />
      <div className="flex justify-between mb-10">
        <span className="fs-18 text-muted">Sub Total</span>
        <span className="fs-18 text-primary">${subTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-10">
        <span className="fs-18 text-muted">Shipping</span>
        <span className="fs-18 fw-medium text-primary">
          ${shipping.toFixed(2)}
        </span>
      </div>
      <hr className="mb-20" />
      <div className="flex justify-between mb-20">
        <span className="fs-24 fw-bold">Total</span>
        <span className="fs-24 fw-bold text-primary">${total.toFixed(2)}</span>
      </div>

      <Button
        className="width-full"
        onClick={onPlaceOrder}
        isLoading={isLoading}
        disabled={isDisabled}
      >
        Place Order
      </Button>
    </div>
  );
};

export default BillingSummary;

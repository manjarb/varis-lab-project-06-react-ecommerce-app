import React from "react";
import useCheckout from "./hooks/useCheckout";
import styles from "./Checkout.module.scss";
import CategoryBanner from "@/pages/Category/components/CategoryBanner/CategoryBanner";
import CheckoutAddressBox from "@/components/CheckoutAddressBox/CheckoutAddressBox";
import CheckoutDeliveryBox from "@/components/CheckoutDeliveryBox/CheckoutDeliveryBox";
import CheckoutPaymentBox from "@/components/CheckoutPaymentBox/CheckoutPaymentBox";
import SummaryOrder from "@/components/SummaryOrder/SummaryOrder";
import BillingSummary from "@/components/BillingSummary/BillingSummary";

const Checkout: React.FC = () => {
  const {
    storeCheckoutAddress,
    checkoutAddress,
    deliveryOptions,
    paymentOptions,
    selectedPaymentOptionId,
    onSelectDeliveryOption,
    onSelectPaymentOption,
    onPlaceOrder,
    selectedDeliveryOptionId,
    billingSummary: { subtotal, shipping, total },
    isPlaceOrderLoading,
  } = useCheckout();

  return (
    <>
      <CategoryBanner name="Checkout" />
      <div className="container pt-50 mb-30">
        <div className="flex gap-20">
          <div className={styles.addressBox}>
            <div className="mb-20">
              <CheckoutAddressBox
                title="Shipping Address"
                checkoutAddress={checkoutAddress}
                onUpdateAddress={storeCheckoutAddress}
              />
            </div>
            <div className="mb-20">
              <CheckoutDeliveryBox
                title="Delivery Options"
                deliveryOptions={deliveryOptions}
                onSelectOption={onSelectDeliveryOption}
                selectedDeliveryId={selectedDeliveryOptionId}
              />
            </div>
            <CheckoutPaymentBox
              title="Payment Options"
              paymentOptions={paymentOptions}
              onSelectOption={onSelectPaymentOption}
              selectedPaymentId={selectedPaymentOptionId}
            />
          </div>
          <div className={styles.summaryBox}>
            <div className="mb-20">
              <SummaryOrder />
            </div>

            <BillingSummary
              subTotal={subtotal}
              shipping={shipping}
              total={total}
              isLoading={isPlaceOrderLoading}
              isDisabled={!checkoutAddress}
              onPlaceOrder={onPlaceOrder}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;

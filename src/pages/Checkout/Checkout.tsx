import React from "react";
import styles from "./Checkout.module.scss";
import useCheckout from "@/features/checkout/useCheckout";
import CategoryBanner from "@/pages/Category/components/CategoryBanner/CategoryBanner";
import CheckoutAddressBox from "@/features/checkout/components/CheckoutAddressBox/CheckoutAddressBox";
import CheckoutDeliveryBox from "@/features/checkout/components/CheckoutDeliveryBox/CheckoutDeliveryBox";
import CheckoutPaymentBox from "@/features/checkout/components/CheckoutPaymentBox/CheckoutPaymentBox";
import SummaryOrder from "@/features/checkout/components/SummaryOrder/SummaryOrder";
import BillingSummary from "@/features/checkout/components/BillingSummary/BillingSummary";

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

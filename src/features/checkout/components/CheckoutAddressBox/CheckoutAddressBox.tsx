import React from "react";
import styles from "./CheckoutAddressBox.module.scss";
import CheckoutAddressForm, {
  CheckoutAddressFormData,
} from "@/features/checkout/components/CheckoutAddressForm/CheckoutAddressForm";

interface CheckoutAddressBoxProps {
  title: string;
  checkoutAddress: CheckoutAddressFormData | null;
  onUpdateAddress: (data: CheckoutAddressFormData) => void;
}

const CheckoutAddressBox: React.FC<CheckoutAddressBoxProps> = ({
  title,
  checkoutAddress,
  onUpdateAddress,
}) => {
  const onSubmitAddress = (data: CheckoutAddressFormData) => {
    onUpdateAddress(data);
  };

  return (
    <div className={`${styles.container} p-20`}>
      <h3 className="fs-20 pb-10">{title}</h3>
      <hr className="mb-20" />
      {checkoutAddress && (
        <p className="lh-1-5 mb-20">
          <span className="fw-bold">Address</span> : {checkoutAddress.address}
          <br />
          <span className="fw-bold">email</span> : {checkoutAddress.email}
          <br />
          <span className="fw-bold">phone</span> : {checkoutAddress.phone}
        </p>
      )}

      <CheckoutAddressForm onSubmit={onSubmitAddress} />
    </div>
  );
};

export default CheckoutAddressBox;

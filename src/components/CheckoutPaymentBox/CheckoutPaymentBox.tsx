import { PaymentOption as TPaymentOption } from "../../types/checkout.type";
import PaymentOption from "../PaymentOption/PaymentOption";
import styles from "./CheckoutPaymentBox.module.scss";

interface CheckoutPaymentBoxProps {
  title: string;
  selectedPaymentId: number;
  paymentOptions: TPaymentOption[];
  onSelectOption: (id: number) => void;
}

const CheckoutPaymentBox: React.FC<CheckoutPaymentBoxProps> = ({
  title,
  paymentOptions,
  selectedPaymentId,
  onSelectOption,
}) => {
  return (
    <div className={`${styles.container} p-20`}>
      <h3 className="fs-20 pb-10">{title}</h3>
      <hr className="mb-20" />

      {paymentOptions.map(({ id, name, description }) => (
        <div key={id} className="mb-10">
          <PaymentOption
            id={id}
            name={name}
            description={description}
            selected={id === selectedPaymentId}
            onSelect={onSelectOption}
          />
        </div>
      ))}
    </div>
  );
};

export default CheckoutPaymentBox;

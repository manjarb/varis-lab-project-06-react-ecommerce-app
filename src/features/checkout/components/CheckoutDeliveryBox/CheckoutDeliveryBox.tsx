import styles from "./CheckoutDeliveryBox.module.scss";
import { DeliveryOption as TDeliveryOption } from "@/features/checkout/types";
import DeliveryOption from "@/features/checkout/components/DeliveryOption/DeliveryOption";

interface CheckoutDeliveryBox {
  title: string;
  selectedDeliveryId: number;
  deliveryOptions: TDeliveryOption[];
  onSelectOption: (id: number) => void;
}

const CheckoutDeliveryBox: React.FC<CheckoutDeliveryBox> = ({
  title,
  deliveryOptions,
  selectedDeliveryId,
  onSelectOption,
}) => {
  return (
    <div className={`${styles.container} p-20`}>
      <h3 className="fs-20 pb-10">{title}</h3>
      <hr className="mb-20" />

      {deliveryOptions.map(({ id, name, description }) => (
        <div key={id} className="mb-10">
          <DeliveryOption
            id={id}
            name={name}
            description={description}
            selected={id === selectedDeliveryId}
            onSelect={onSelectOption}
          />
        </div>
      ))}
    </div>
  );
};

export default CheckoutDeliveryBox;

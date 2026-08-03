import React from "react";
import RadioInput from "@/shared/components/RadioInput/RadioInput";

interface DeliveryOptionProps {
  id: number;
  name: string;
  description: string;
  selected: boolean;
  onSelect: (id: number) => void;
}

const DeliveryOption: React.FC<DeliveryOptionProps> = ({
  id,
  name,
  description,
  selected,
  onSelect,
}) => {
  return (
    <RadioInput
      id={`delivery-option-${id}`}
      name="deliveryOption"
      checked={selected}
      onChange={() => onSelect(id)}
      label={
        <>
          <span className="mr-5">{name}</span>|
          <span className="ml-5">{description}</span>
        </>
      }
    />
  );
};

export default DeliveryOption;

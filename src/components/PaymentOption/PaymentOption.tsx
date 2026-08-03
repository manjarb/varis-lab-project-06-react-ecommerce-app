import React from "react";
import RadioInput from "@/shared/components/RadioInput/RadioInput";

interface PaymentOptionProps {
  id: number;
  name: string;
  description: string;
  selected: boolean;
  onSelect: (id: number) => void;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({
  id,
  name,
  description,
  selected,
  onSelect,
}) => {
  return (
    <RadioInput
      id={`payment-option-${id}`}
      name="paymentOption"
      checked={selected}
      onChange={() => onSelect(id)}
      label={
        <>
          <span className="fw-medium">{name}</span>
          <br />
          <span className="text-muted">{description}</span>
        </>
      }
    />
  );
};

export default PaymentOption;

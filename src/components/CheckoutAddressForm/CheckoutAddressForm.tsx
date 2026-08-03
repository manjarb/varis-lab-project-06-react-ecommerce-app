import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input/Input";
import Button from "../Button/Button";
import {
  checkoutAddressSchema,
  CheckoutAddressFormData,
} from "./checkoutAddress.schema";

export type { CheckoutAddressFormData };

interface CheckoutAddressFormProps {
  onSubmit: (data: CheckoutAddressFormData) => void;
}

const CheckoutAddressForm: React.FC<CheckoutAddressFormProps> = ({
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutAddressFormData>({
    resolver: zodResolver(checkoutAddressSchema),
  });

  const onFormSubmit = (data: CheckoutAddressFormData) => {
    onSubmit({ ...data });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="mb-15">
        <Input
          label="Address"
          type="text"
          placeholder="Enter Address"
          {...register("address")}
          error={errors.address?.message}
        />
      </div>

      <div className="flex gap-15 mb-15">
        <div className="width-50">
          <Input
            label="Email"
            type="email"
            placeholder="Enter Email"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
        <div className="width-50">
          <Input
            label="Phone Number"
            type="text"
            placeholder="Enter Phone Number"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CheckoutAddressForm;

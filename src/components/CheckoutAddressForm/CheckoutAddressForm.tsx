import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../Input/Input";
import Button from "../Button/Button";

export interface CheckoutAddressFormData {
  address: string;
  email: string;
  phone: string;
}

interface CheckoutAddressFormProps {
  onSubmit: (data: CheckoutAddressFormData) => void;
}

// Yup schema for validation
const validationSchema = yup.object().shape({
  address: yup.string().required("Address is required"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: yup.string().required("Phone number is required"),
});

const CheckoutAddressForm: React.FC<CheckoutAddressFormProps> = ({
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutAddressFormData>({
    resolver: yupResolver(validationSchema),
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

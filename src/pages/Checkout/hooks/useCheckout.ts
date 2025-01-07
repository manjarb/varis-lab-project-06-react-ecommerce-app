import { useMemo, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { CheckoutAddressFormData } from "../../../components/CheckoutAddressForm/CheckoutAddressForm";
import {
  deliveryOptions,
  paymentOptions,
} from "../../../consts/checkout.const";
import { useCart } from "../../../hooks/useCart/useCart";
import useProductRoute from "../../../hooks/useProductRoute/useProductRoute";
import { config } from "../../../configs/environment";

const useCheckout = () => {
  const [checkoutAddress, setCheckoutAddress] =
    useState<CheckoutAddressFormData | null>(null);
  const [selectedDeliveryOptionId, setSelectedDeliveryOptionId] =
    useState<number>(deliveryOptions[0].id);
  const [selectedPaymentOptionId, setSelectedPaymentOptionId] =
    useState<number>(paymentOptions[0].id);
  const { goToOrderSuccess } = useProductRoute();
  const { cart } = useCart();

  // Helper to get selected delivery option
  const selectedDeliveryOption = useMemo(
    () =>
      deliveryOptions.find((option) => option.id === selectedDeliveryOptionId),
    [selectedDeliveryOptionId]
  );

  // Compute billing summary data
  const billingSummary = useMemo(() => {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping = selectedDeliveryOption?.price || 0; // Get price of the selected delivery option
    const total = subtotal + shipping;

    return { subtotal, shipping, total };
  }, [cart, selectedDeliveryOption]);

  const storeCheckoutAddress = (addressData: CheckoutAddressFormData) => {
    setCheckoutAddress(addressData);
  };

  const onSelectDeliveryOption = (optionId: number) => {
    setSelectedDeliveryOptionId(optionId);
  };

  const onSelectPaymentOption = (optionId: number) => {
    setSelectedPaymentOptionId(optionId);
  };

  const placeOrder = async (
    userId: number,
    cartItems: { id: number; quantity: number }[],
    address: CheckoutAddressFormData
  ) => {
    const response = await axios.post(`${config.baseURL}/carts/add`, {
      userId,
      products: cartItems,
      address,
    });
    return response.data;
  };

  const { mutate: placeOrderMutate, isPending: isPlaceOrderLoading } =
    useMutation({
      mutationFn: () => {
        if (!checkoutAddress) {
          throw new Error("Delivery Address is Missing");
        }

        return placeOrder(
          1, // Replace with the actual user ID
          cart.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          checkoutAddress
        );
      },
      onSuccess: () => {
        goToOrderSuccess();
      },
    });

  const onPlaceOrder = () => {
    placeOrderMutate();
  };

  return {
    checkoutAddress,
    deliveryOptions,
    paymentOptions,
    selectedDeliveryOptionId,
    selectedPaymentOptionId,
    billingSummary,
    isPlaceOrderLoading,
    storeCheckoutAddress,
    onSelectDeliveryOption,
    onSelectPaymentOption,
    onPlaceOrder,
  };
};

export default useCheckout;

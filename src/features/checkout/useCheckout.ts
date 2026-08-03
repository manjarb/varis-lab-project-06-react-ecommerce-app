import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckoutAddressFormData } from "@/features/checkout/schema";
import { deliveryOptions, paymentOptions } from "@/features/checkout/consts";
import { useCart } from "@/features/cart/useCart";
import useProductRoute from "@/shared/hooks/useProductRoute";
import { placeOrder } from "@/features/checkout/api";

const useCheckout = () => {
  const [checkoutAddress, setCheckoutAddress] =
    useState<CheckoutAddressFormData | null>(null);
  const [selectedDeliveryOptionId, setSelectedDeliveryOptionId] =
    useState<number>(deliveryOptions[0].id);
  const [selectedPaymentOptionId, setSelectedPaymentOptionId] =
    useState<number>(paymentOptions[0].id);
  const { goToOrderSuccess } = useProductRoute();
  const { cart, clearCart } = useCart();

  // Helper to get selected delivery option
  const selectedDeliveryOption = useMemo(
    () =>
      deliveryOptions.find((option) => option.id === selectedDeliveryOptionId),
    [selectedDeliveryOptionId],
  );

  // Compute billing summary data
  const billingSummary = useMemo(() => {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
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

  const { mutate: placeOrderMutate, isPending: isPlaceOrderLoading } =
    useMutation({
      mutationFn: () => {
        if (!checkoutAddress) {
          throw new Error("Delivery Address is Missing");
        }

        return placeOrder({
          userId: 1,
          products: cart.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          address: checkoutAddress,
        });
      },
      onSuccess: () => {
        clearCart();
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

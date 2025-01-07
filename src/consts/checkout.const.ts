import { DeliveryOption, PaymentOption } from "../types/checkout.type";

export const deliveryOptions: DeliveryOption[] = [
  {
    id: 1,
    name: "Standard Delivery",
    description: "Approx 5 to 7 Days",
    estimatedTime: "5-7 Days",
    price: 5.99,
  },
  {
    id: 2,
    name: "Express Delivery",
    description: "Approx 1 - 2 Days",
    estimatedTime: "1-2 Days",
    price: 15.99,
  },
];

export const paymentOptions: PaymentOption[] = [
  {
    id: 3,
    name: "Cash on Delivery",
    description: "Pay cash when your order is delivered.",
  },
  {
    id: 4,
    name: "Bank Transfer",
    description: "Pay directly from your bank account.",
  },
];

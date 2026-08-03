import { apiClient } from "@/shared/api/client";
import { CheckoutAddressFormData } from "@/features/checkout/components/CheckoutAddressForm/CheckoutAddressForm";

export interface PlaceOrderPayload {
  userId: number;
  products: { id: number; quantity: number }[];
  address: CheckoutAddressFormData;
}

export interface PlaceOrderResponse {
  id: number;
}

export async function placeOrder(
  payload: PlaceOrderPayload,
): Promise<PlaceOrderResponse> {
  const { data } = await apiClient.post<PlaceOrderResponse>(
    "/carts/add",
    payload,
  );
  return data;
}

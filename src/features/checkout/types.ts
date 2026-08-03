export interface DeliveryOption {
  id: number;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
}

export interface PaymentOption {
  id: number;
  name: string;
  description: string;
}

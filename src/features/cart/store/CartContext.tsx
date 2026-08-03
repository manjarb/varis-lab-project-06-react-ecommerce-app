import { createContext } from "react";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  originalPrice?: number;
}

export interface CartState {
  items: CartItem[];
}

export interface CartContextProps {
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export enum CartActionTypes {
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_FROM_CART = "REMOVE_FROM_CART",
  UPDATE_QUANTITY = "UPDATE_QUANTITY",
  CLEAR_CART = "CLEAR_CART",
}

export const CartContext = createContext<CartContextProps | undefined>(
  undefined,
);

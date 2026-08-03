import React, { useReducer } from "react";
import {
  CartActionTypes,
  CartContext,
  CartItem,
  CartState,
} from "./CartContext";
import { cartReducer } from "./cartReducer";

const initialState: CartState = {
  items: [],
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item: CartItem) => {
    dispatch({ type: CartActionTypes.ADD_TO_CART, payload: item });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: CartActionTypes.REMOVE_FROM_CART, payload: { id } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({
      type: CartActionTypes.UPDATE_QUANTITY,
      payload: { id, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CartActionTypes.CLEAR_CART });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

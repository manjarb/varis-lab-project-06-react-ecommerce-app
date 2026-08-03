import React, { useEffect, useReducer } from "react";
import { CartActionTypes, CartContext, CartItem } from "./CartContext";
import { cartReducer } from "./cartReducer";
import { loadCartState, saveCartState } from "./cartStorage";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCartState);

  useEffect(() => {
    saveCartState(cart);
  }, [cart]);

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

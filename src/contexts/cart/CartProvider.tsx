import React, { useReducer } from "react";
import {
  CartActionTypes,
  CartContext,
  CartItem,
  CartState,
} from "./CartContext";

type CartAction =
  | {
      type: CartActionTypes.ADD_TO_CART;
      payload: CartItem & { id: number };
    }
  | { type: CartActionTypes.REMOVE_FROM_CART; payload: { id: number } }
  | {
      type: CartActionTypes.UPDATE_QUANTITY;
      payload: { id: number; quantity: number };
    };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case CartActionTypes.ADD_TO_CART: {
      const {
        id,
        title,
        price,
        quantity = 1,
        image,
        originalPrice,
      } = action.payload;

      // Check if the item already exists in the cart
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        // Update quantity if the item exists
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      // Add new item to the cart
      return {
        ...state,
        items: [
          ...state.items,
          { id, title, price, quantity, image, originalPrice },
        ],
      };
    }
    case CartActionTypes.REMOVE_FROM_CART: {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }
    case CartActionTypes.UPDATE_QUANTITY: {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initialState: CartState = {
    items: [],
  };
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item: CartItem) => {
    dispatch({ type: CartActionTypes.ADD_TO_CART, payload: item });
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    dispatch({ type: CartActionTypes.REMOVE_FROM_CART, payload: { id } });
  };

  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    dispatch({
      type: CartActionTypes.UPDATE_QUANTITY,
      payload: { id, quantity },
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

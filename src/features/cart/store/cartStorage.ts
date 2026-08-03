import { CartState } from "./CartContext";

export const CART_STORAGE_KEY = "ecommerce-cart:v1";

const EMPTY: CartState = { items: [] };

export function loadCartState(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Array.isArray((parsed as CartState).items)
    ) {
      return parsed as CartState;
    }
    return EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveCartState(state: CartState): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — cart just won't persist.
  }
}

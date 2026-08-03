import { CartState } from "./CartContext";
import { CART_STORAGE_KEY, loadCartState, saveCartState } from "./cartStorage";

const sample: CartState = {
  items: [{ id: 1, title: "Widget", price: 10, quantity: 2, image: "/w.png" }],
};

describe("cartStorage", () => {
  it("round-trips cart state", () => {
    saveCartState(sample);
    expect(loadCartState()).toEqual(sample);
  });

  it("returns an empty cart when nothing is stored", () => {
    expect(loadCartState()).toEqual({ items: [] });
  });

  it("returns an empty cart when stored JSON is corrupt", () => {
    localStorage.setItem(CART_STORAGE_KEY, "{not json");
    expect(loadCartState()).toEqual({ items: [] });
  });

  it("returns an empty cart when the stored shape is wrong", () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: "nope" }));
    expect(loadCartState()).toEqual({ items: [] });
  });
});

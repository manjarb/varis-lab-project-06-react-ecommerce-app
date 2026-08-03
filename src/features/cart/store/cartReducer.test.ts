import { CartActionTypes, CartItem, CartState } from "./CartContext";
import { cartReducer } from "./cartReducer";

const item = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 1,
  title: "Widget",
  price: 10,
  quantity: 1,
  image: "/widget.png",
  ...overrides,
});

const stateWith = (...items: CartItem[]): CartState => ({ items });

describe("cartReducer", () => {
  it("adds a new item", () => {
    const next = cartReducer(stateWith(), {
      type: CartActionTypes.ADD_TO_CART,
      payload: item(),
    });
    expect(next.items).toEqual([item()]);
  });

  it("merges quantity when the item already exists", () => {
    const next = cartReducer(stateWith(item({ quantity: 2 })), {
      type: CartActionTypes.ADD_TO_CART,
      payload: item({ quantity: 3 }),
    });
    expect(next.items).toEqual([item({ quantity: 5 })]);
  });

  it("removes an item", () => {
    const next = cartReducer(stateWith(item(), item({ id: 2 })), {
      type: CartActionTypes.REMOVE_FROM_CART,
      payload: { id: 1 },
    });
    expect(next.items).toEqual([item({ id: 2 })]);
  });

  it("updates quantity", () => {
    const next = cartReducer(stateWith(item()), {
      type: CartActionTypes.UPDATE_QUANTITY,
      payload: { id: 1, quantity: 7 },
    });
    expect(next.items[0]?.quantity).toBe(7);
  });

  it("clears the cart", () => {
    const next = cartReducer(stateWith(item(), item({ id: 2 })), {
      type: CartActionTypes.CLEAR_CART,
    });
    expect(next.items).toEqual([]);
  });
});

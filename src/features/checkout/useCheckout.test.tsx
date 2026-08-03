import { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import useCheckout from "./useCheckout";
import { CartProvider } from "@/features/cart/store/CartProvider";
import { CART_STORAGE_KEY } from "@/features/cart/store/cartStorage";
import { useCart } from "@/features/cart/useCart";
import { createTestQueryClient } from "@/test/utils";

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter initialEntries={["/checkout"]}>
      <QueryClientProvider client={createTestQueryClient()}>
        <CartProvider>{children}</CartProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe("useCheckout", () => {
  it("clears the cart after a successful order", async () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: [
          { id: 1, title: "Widget", price: 10, quantity: 2, image: "/w.png" },
        ],
      }),
    );

    const { result } = renderHook(
      () => ({ checkout: useCheckout(), cart: useCart() }),
      { wrapper },
    );

    expect(result.current.cart.cart.items).toHaveLength(1);
    expect(result.current.checkout.billingSummary.subtotal).toBe(20);

    act(() => {
      result.current.checkout.storeCheckoutAddress({
        address: "1 Main St",
        email: "jane@example.com",
        phone: "0812345678",
      });
    });

    act(() => {
      result.current.checkout.onPlaceOrder();
    });

    await waitFor(() => expect(result.current.cart.cart.items).toHaveLength(0));
  });

  it("errors and keeps the cart when no address is set", async () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: [
          { id: 1, title: "Widget", price: 10, quantity: 2, image: "/w.png" },
        ],
      }),
    );

    const { result } = renderHook(
      () => ({ checkout: useCheckout(), cart: useCart() }),
      { wrapper },
    );

    act(() => {
      result.current.checkout.onPlaceOrder();
    });

    await waitFor(() =>
      expect(result.current.checkout.isPlaceOrderLoading).toBe(false),
    );
    expect(result.current.cart.cart.items).toHaveLength(1);
  });
});

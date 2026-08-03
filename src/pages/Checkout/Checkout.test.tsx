import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CART_STORAGE_KEY } from "@/features/cart/store/cartStorage";
import { renderRoute } from "@/test/renderRoute";

describe("Checkout page", () => {
  it("places an order and navigates to the success page", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: [
          { id: 1, title: "Widget", price: 10, quantity: 2, image: "/w.png" },
        ],
      }),
    );

    const { router } = renderRoute("/checkout");

    await user.type(screen.getByPlaceholderText("Enter Address"), "1 Main St");
    await user.type(
      screen.getByPlaceholderText("Enter Email"),
      "jane@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("Enter Phone Number"),
      "0812345678",
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await user.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/order/success"),
    );
    expect(screen.getByText("Order Placed Successfully!")).toBeInTheDocument();
  });
});

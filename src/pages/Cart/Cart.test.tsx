import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CART_STORAGE_KEY } from "@/features/cart/store/cartStorage";
import { renderRoute } from "@/test/renderRoute";

function seedCart() {
  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify({
      items: [
        { id: 1, title: "Widget", price: 10, quantity: 1, image: "/w.png" },
      ],
    }),
  );
}

describe("Cart page", () => {
  it("shows the empty state when there are no items", async () => {
    renderRoute("/cart");
    expect(await screen.findByText("Your Cart is Empty")).toBeInTheDocument();
  });

  it("updates quantity and total", async () => {
    const user = userEvent.setup();
    seedCart();
    renderRoute("/cart");

    expect(await screen.findByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("Total Price: $10.00")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: ">" }));
    expect(screen.getByText("Total Price: $20.00")).toBeInTheDocument();
  });

  it("removes an item", async () => {
    const user = userEvent.setup();
    seedCart();
    renderRoute("/cart");

    await user.click(await screen.findByRole("button", { name: "×" }));
    expect(await screen.findByText("Your Cart is Empty")).toBeInTheDocument();
  });
});

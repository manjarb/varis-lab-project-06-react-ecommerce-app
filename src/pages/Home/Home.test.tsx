import { screen } from "@testing-library/react";
import { renderRoute } from "@/test/renderRoute";

describe("Home page", () => {
  it("renders deal products and category products from the API", async () => {
    renderRoute("/");

    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(await screen.findByText("beauty product 1")).toBeInTheDocument();
  });
});

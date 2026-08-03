import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "@/test/renderRoute";

describe("Category page", () => {
  it("switches category and pages through results", async () => {
    const user = userEvent.setup();
    renderRoute("/categories");

    expect(await screen.findByText("beauty product 1")).toBeInTheDocument();

    // The Footer also lists "Fragrances" as a static (non-interactive) <li>;
    // scope to the clickable CategoryMenu <span> to avoid ambiguity.
    await user.click(screen.getByText("Fragrances", { selector: "span" }));
    expect(await screen.findByText("fragrances product 1")).toBeInTheDocument();

    await user.click(screen.getByText("2"));
    expect(
      await screen.findByText("fragrances product 21"),
    ).toBeInTheDocument();
  });
});

import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { createTestQueryClient } from "./utils";
import { routes } from "@/app/router";
import { CartProvider } from "@/features/cart/store/CartProvider";

export function renderRoute(initialPath: string) {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
  });

  return {
    router,
    ...render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </QueryClientProvider>,
    ),
  };
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";

import "react-loading-skeleton/dist/skeleton.css";
import { CartProvider } from "./contexts/cart/CartProvider.tsx";

// Create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <App />
      </CartProvider>
    </QueryClientProvider>
  </StrictMode>,
);

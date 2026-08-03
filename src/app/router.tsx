import { createBrowserRouter, RouteObject } from "react-router";
import RouteErrorFallback from "./RouteErrorFallback";
import MainLayout from "@/app/layouts/MainLayout/MainLayout";
import Home from "@/pages/Home/Home";
import Category from "@/pages/Category/Category";
import Product from "@/pages/Product/Product";
import Cart from "@/pages/Cart/Cart";
import Checkout from "@/pages/Checkout/Checkout";
import OrderSuccess from "@/pages/Order/OrderSuccess";

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/categories", element: <Category /> },
      { path: "/products/:id", element: <Product /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order/success", element: <OrderSuccess /> },
    ],
  },
];

export const router = createBrowserRouter(routes);

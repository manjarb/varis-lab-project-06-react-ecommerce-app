import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./pages/Home/Home";
import MainLayout from "./Layouts/MainLayout/MainLayout";
import Category from "./pages/Category/Category";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/Order/OrderSuccess";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/categories", element: <Category /> },
      { path: "/products/:id", element: <Product /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order/success", element: <OrderSuccess /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import { useNavigate } from "react-router-dom";

const useProductRoute = () => {
  const navigate = useNavigate();

  const goToProductDetails = (id: number) => {
    navigate(`/products/${id}`);
  };

  const goToCartSummary = () => {
    navigate("/cart");
  };

  const goToCheckout = () => {
    navigate("/checkout");
  };

  const goToOrderSuccess = () => {
    navigate("/order/success");
  };

  return {
    goToProductDetails,
    goToCartSummary,
    goToCheckout,
    goToOrderSuccess,
  };
};

export default useProductRoute;

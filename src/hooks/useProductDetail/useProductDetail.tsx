import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Product } from "../../types/product.type";
import { config } from "../../configs/environment";

const useProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const fetchProductDetail = async (productId: string) => {
    try {
      const { data } = await axios.get<Product>(
        `${config.baseURL}/products/${productId}`
      );
      return data; // Return the product details
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  };

  const { data: productDetail, isLoading } = useQuery({
    queryKey: ["productDetail", id], // Query key to manage cache
    queryFn: () => fetchProductDetail(id as string), // Empty function call, you can trigger refetch later
    enabled: !!id, // Disable auto-fetching
  });

  return {
    productDetail,
    isLoading,
  };
};

export default useProductDetail;

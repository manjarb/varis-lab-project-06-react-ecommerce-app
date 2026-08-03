import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { calculateOffset } from "../../utils/pagination.utils";
import { Category, FetchProductsResponse } from "../../types/product.type";
import { Pagination } from "../../types/generic.type";
import { config } from "../../configs/environment";

const useProducts = () => {
  const defaultLimit = 20;
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Fetch products function
  const fetchProducts = async (page: number = 1, limit = defaultLimit) => {
    try {
      const { data } = await axios.get<FetchProductsResponse>(
        `${config.baseURL}/products`,
        {
          params: {
            skip: calculateOffset(page, limit), // Use reusable offset calculation
            limit, // Limit the number of products
          },
        },
      );
      return data; // Return the entire API response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products",
        { cause: error },
      );
    }
  };

  const fetchProductsByCategory = async ({
    category,
    page = 1,
    limit = defaultLimit,
  }: {
    category: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const { data } = await axios.get<FetchProductsResponse>(
        `${config.baseURL}/products/category/${category}`,
        {
          params: {
            skip: calculateOffset(page, limit), // Use reusable offset calculation
            limit, // Limit the number of products
          },
        },
      );
      return data; // Return the entire API response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products",
        { cause: error },
      );
    }
  };

  const fetchProductCategories = async () => {
    try {
      const { data } = await axios.get<Category[]>(
        `${config.baseURL}/products/categories`,
      );
      return data; // Return the entire API response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product categories",
        { cause: error },
      );
    }
  };

  const onUpdatePage = (newPage: number) => {
    setPage(newPage);
  };

  // Use Query with a dynamic function call
  const { data: fiveProducts, refetch: fetchBestProducts } = useQuery({
    queryKey: ["fiveProducts", page],
    queryFn: () => fetchProducts(page, 5),
    enabled: false,
  });

  const { data: categories, refetch: fetchCategories } = useQuery({
    queryKey: ["productCategories"],
    queryFn: fetchProductCategories,
    enabled: false,
  });

  const {
    mutate: fetchProductsFromCategory,
    data: productsFromCategory,
    isPending: isProductsFromCategoryLoading,
  } = useMutation({
    mutationFn: fetchProductsByCategory,
    onSuccess: ({ total, skip, limit }: FetchProductsResponse) => {
      setPagination({ total, skip, limit });
    },
  });

  return {
    fetchBestProducts,
    fetchCategories,
    fetchProductsFromCategory,
    onUpdatePage,
    bestProducts: fiveProducts?.products,
    categories,
    productsFromCategory,
    pagination,
    page,
    defaultLimit,
    isProductsFromCategoryLoading,
  };
};

export default useProducts;

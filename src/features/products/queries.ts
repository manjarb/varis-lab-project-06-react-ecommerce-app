import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  CategoryProductsParams,
  ProductListParams,
  getCategories,
  getProduct,
  getProducts,
  getProductsByCategory,
} from "./api";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: ProductListParams) =>
    [...productKeys.lists(), params] as const,
  byCategory: (params: CategoryProductsParams) =>
    [...productKeys.lists(), "category", params] as const,
  categories: () => [...productKeys.all, "categories"] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...productKeys.details(), String(id)] as const,
};

export const productQueries = {
  list: (params: ProductListParams = {}) =>
    queryOptions({
      queryKey: productKeys.list(params),
      queryFn: () => getProducts(params),
    }),

  byCategory: (params: CategoryProductsParams) =>
    queryOptions({
      queryKey: productKeys.byCategory(params),
      queryFn: () => getProductsByCategory(params),
      placeholderData: keepPreviousData,
    }),

  categories: () =>
    queryOptions({
      queryKey: productKeys.categories(),
      queryFn: getCategories,
      staleTime: 5 * 60 * 1000,
    }),

  detail: (id: string | number) =>
    queryOptions({
      queryKey: productKeys.detail(id),
      queryFn: () => getProduct(id),
    }),
};

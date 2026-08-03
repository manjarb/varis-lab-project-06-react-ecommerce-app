import { apiClient } from "@/shared/api/client";
import {
  Category,
  FetchProductsResponse,
  Product,
} from "@/features/products/types";
import { calculateOffset } from "@/shared/utils/pagination.utils";

export interface ProductListParams {
  page?: number;
  limit?: number;
}

export interface CategoryProductsParams extends ProductListParams {
  category: string;
}

export async function getProducts({
  page = 1,
  limit = 20,
}: ProductListParams = {}): Promise<FetchProductsResponse> {
  const { data } = await apiClient.get<FetchProductsResponse>("/products", {
    params: { skip: calculateOffset(page, limit), limit },
  });
  return data;
}

export async function getProductsByCategory({
  category,
  page = 1,
  limit = 20,
}: CategoryProductsParams): Promise<FetchProductsResponse> {
  const { data } = await apiClient.get<FetchProductsResponse>(
    `/products/category/${category}`,
    { params: { skip: calculateOffset(page, limit), limit } },
  );
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/products/categories");
  return data;
}

export async function getProduct(id: string | number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
}

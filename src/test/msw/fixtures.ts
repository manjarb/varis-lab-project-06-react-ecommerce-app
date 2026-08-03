import {
  Category,
  FetchProductsResponse,
  Product,
} from "@/features/products/types";

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description: "A popular mascara.",
    category: "beauty",
    price: 9.99,
    discountPercentage: 7.17,
    rating: 4.94,
    stock: 5,
    tags: ["beauty", "mascara"],
    brand: "Essence",
    sku: "RCH45Q1A",
    weight: 2,
    dimensions: { width: 23.17, height: 14.43, depth: 28.01 },
    warrantyInformation: "1 month warranty",
    shippingInformation: "Ships in 1 month",
    availabilityStatus: "Low Stock",
    reviews: [
      {
        rating: 5,
        comment: "Very happy with my purchase!",
        date: "2024-05-23T08:56:21.618Z",
        reviewerName: "John Doe",
        reviewerEmail: "john@x.dummyjson.com",
      },
    ],
    returnPolicy: "30 days return policy",
    minimumOrderQuantity: 24,
    meta: {
      createdAt: "2024-05-23T08:56:21.618Z",
      updatedAt: "2024-05-23T08:56:21.618Z",
      barcode: "9164035109868",
      qrCode: "https://assets.dummyjson.com/public/qr-code.png",
    },
    images: ["https://cdn.dummyjson.com/products/images/beauty/1.png"],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/1-thumb.png",
    ...overrides,
  };
}

export function makeProductsResponse(
  count: number,
  overrides: Partial<FetchProductsResponse> = {},
): FetchProductsResponse {
  return {
    products: Array.from({ length: count }, (_, i) =>
      makeProduct({ id: i + 1, title: `Product ${i + 1}` }),
    ),
    total: 100,
    skip: 0,
    limit: count,
    ...overrides,
  };
}

export const categories: Category[] = [
  {
    slug: "beauty",
    name: "Beauty",
    url: "https://dummyjson.com/products/category/beauty",
  },
  {
    slug: "fragrances",
    name: "Fragrances",
    url: "https://dummyjson.com/products/category/fragrances",
  },
  {
    slug: "furniture",
    name: "Furniture",
    url: "https://dummyjson.com/products/category/furniture",
  },
];

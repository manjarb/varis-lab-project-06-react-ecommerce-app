import { renderHook, waitFor } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { productQueries } from "./queries";
import { createQueryWrapper } from "@/test/utils";

describe("productQueries", () => {
  it("list fetches products with the given limit", async () => {
    const { result } = renderHook(
      () => useQuery(productQueries.list({ limit: 5 })),
      { wrapper: createQueryWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.products).toHaveLength(5);
  });

  it("byCategory fetches products for a category and page", async () => {
    const { result } = renderHook(
      () =>
        useQuery(
          productQueries.byCategory({ category: "beauty", page: 2, limit: 20 }),
        ),
      { wrapper: createQueryWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.skip).toBe(20);
    expect(result.current.data?.products[0]?.title).toBe("beauty product 21");
  });

  it("categories fetches the category list", async () => {
    const { result } = renderHook(() => useQuery(productQueries.categories()), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((c) => c.slug)).toEqual([
      "beauty",
      "fragrances",
      "furniture",
    ]);
  });

  it("detail fetches a single product", async () => {
    const { result } = renderHook(() => useQuery(productQueries.detail(7)), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe(7);
  });
});

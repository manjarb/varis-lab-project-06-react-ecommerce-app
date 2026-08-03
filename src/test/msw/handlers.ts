import { http, HttpResponse } from "msw";
import { categories, makeProduct, makeProductsResponse } from "./fixtures";

const BASE = "https://dummyjson.com";

export const handlers = [
  http.get(`${BASE}/products/categories`, () => HttpResponse.json(categories)),

  http.get(`${BASE}/products/category/:slug`, ({ request, params }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const skip = Number(url.searchParams.get("skip") ?? 0);
    return HttpResponse.json(
      makeProductsResponse(limit, {
        skip,
        limit,
        products: Array.from({ length: limit }, (_, i) =>
          makeProduct({
            id: skip + i + 1,
            title: `${String(params.slug)} product ${skip + i + 1}`,
            category: String(params.slug),
          }),
        ),
      }),
    );
  }),

  http.get(`${BASE}/products/:id`, ({ params }) =>
    HttpResponse.json(makeProduct({ id: Number(params.id) })),
  ),

  http.get(`${BASE}/products`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const skip = Number(url.searchParams.get("skip") ?? 0);
    return HttpResponse.json(makeProductsResponse(limit, { skip, limit }));
  }),

  http.post(`${BASE}/carts/add`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: 1, ...body }, { status: 201 });
  }),
];

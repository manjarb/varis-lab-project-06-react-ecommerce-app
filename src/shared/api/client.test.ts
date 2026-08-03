import { http, HttpResponse } from "msw";

import { ApiError, apiClient } from "./client";
import { server } from "@/test/msw/server";

describe("apiClient", () => {
  it("returns response data on success", async () => {
    const { data } = await apiClient.get("/products/1");
    expect(data.id).toBe(1);
  });

  it("normalizes server errors into ApiError with the server message", async () => {
    server.use(
      http.get("https://dummyjson.com/products/1", () =>
        HttpResponse.json({ message: "Product not found" }, { status: 404 }),
      ),
    );

    const error = await apiClient.get("/products/1").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Product not found");
    expect(error.status).toBe(404);
  });

  it("falls back to a generic message when the server sends none", async () => {
    server.use(
      http.get("https://dummyjson.com/products/1", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    const error = await apiClient.get("/products/1").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Something went wrong. Please try again.");
  });
});

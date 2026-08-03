# React E-commerce App Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the app to current (Aug 2026) stable dependencies and refactor it to idiomatic TanStack Query usage, a feature-based structure, and a Vitest/RTL/MSW test suite — with identical UI/UX plus small fixes (cart persistence, clear-cart-after-order, inline error states).

**Architecture:** Phased in-place modernization on branch `refactor/modernization`. Phase 1 (Tasks 1–5) upgrades toolchain and dependencies. Phase 2 (Tasks 6–11) builds the new data layer in final locations and swaps pages onto it. Phase 3 (Tasks 12–14) moves remaining files into `app/`/`pages/`/`features/`/`shared/`. Phase 4 (Tasks 15–20) adds cart fixes, error states, and the test suite. The app must build and run after every task.

**Tech Stack:** React 19.2, Vite 8.2, react-router 8.3 (data mode), TanStack Query 5.101, TypeScript 6.0.3, ESLint 10 + Prettier, zod 4, axios, SCSS modules, Vitest 4 + React Testing Library 16 + MSW 2.

**Spec:** `docs/superpowers/specs/2026-08-04-modernization-design.md`

## Global Constraints

- Node **≥22.22.0** required (react-router 8 engine floor). Verify with `node --version` before Task 1.
- Branch: all work on `refactor/modernization`. Commit after every task (steps say when).
- Exact dependency targets: react `19.2.8`, react-dom `19.2.8`, vite `8.2.0`, @vitejs/plugin-react `6.0.5`, react-router `8.3.0`, typescript `6.0.3`, @tanstack/react-query `5.101.4`, @tanstack/react-query-devtools `5.101.4`, @tanstack/eslint-plugin-query `5.101.4`, zod `4.4.3`, @hookform/resolvers `5.7.1`, eslint `10.8.0`, typescript-eslint `8.65.0`, eslint-plugin-import-x `4.17.1`, vitest `4.1.10`, @testing-library/react `16.3.2`, @testing-library/jest-dom `7.0.0`, @testing-library/user-event `14.6.1`, msw `2.15.0`, jsdom `30.0.1`, prettier `3.9.6`.
- Do NOT install TypeScript 7.x — typescript-eslint supports only `<6.1.0`.
- `react-router-dom` is removed in Router 8: all router imports come from `react-router`, except `RouterProvider` which comes from `react-router/dom`.
- The API base URL stays in `.env` as `VITE_API_BASE_URL=https://dummyjson.com`.
- UI/UX must not change except: per-query loading states, inline error states, cart persistence, cart cleared after successful order.
- Verification gate for every task: `npm run build && npm run lint && npm run test` all pass (test script exists from Task 4 on), plus browser smoke test where the task says so.
- If a dependency upgrade surfaces new type errors, fix them minimally and preserve runtime behavior; note each such fix in the commit message body.
- Import style after Task 3: use the `@/` alias for all cross-directory imports; relative `./` only within the same directory.

---

## Phase 1 — Toolchain and dependency upgrades

### Task 1: Node check + React 19 / Vite 8 / TypeScript 6 upgrade

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify (only if type errors surface): files listed by `tsc -b`

**Interfaces:**
- Produces: a building, running app on react@19.2.8, vite@8.2.0, @vitejs/plugin-react@6.0.5, typescript@6.0.3. No source API changes.

- [ ] **Step 1: Verify Node version**

Run: `node --version`
Expected: ≥ `v22.22.0`. If lower, stop and update the Node 22 line first (`nvm install 22 && nvm use 22 && nvm alias default 22`, or `brew upgrade node@22`), then re-check. Do not proceed on an older Node.

- [ ] **Step 2: Upgrade core packages**

```bash
npm install react@19.2.8 react-dom@19.2.8
npm install -D @types/react@19.2.18 @types/react-dom@19.2.4 vite@8.2.0 @vitejs/plugin-react@6.0.5 typescript@6.0.3 sass@1.102.0
```

Expected: installs succeed. If npm reports peer conflicts from `@fortawesome/react-fontawesome`, `swiper`, `react-modal`, `react-paginate`, `react-loading-skeleton`, or `react-spinners`, run `npm install <pkg>@latest` for the conflicting package (all have React-19-compatible latest versions — verified 2026-08-04).

- [ ] **Step 3: Typecheck and fix any new errors**

Run: `npx tsc -b`
Expected: clean, or a short list of new strictness errors from TS 6. Fix each minimally (no behavior changes). Known safe pattern in this codebase: `forwardRef` in `src/components/Input/Input.tsx` still works under React 19 — do not refactor it in this task.

- [ ] **Step 4: Build and smoke test**

Run: `npm run build`
Expected: `tsc -b && vite build` succeeds, `dist/` produced.

Run: `npm run dev`, open http://localhost:5173 — verify Home renders products, navigate to Products, a product detail, add to cart, view cart. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: upgrade to React 19, Vite 8, TypeScript 6"
```

---

### Task 2: react-router 8 migration (data mode)

**Files:**
- Modify: `package.json` (remove `react-router-dom`, add `react-router@8.3.0`)
- Modify: `src/App.tsx` (createBrowserRouter conversion)
- Modify: `src/Layouts/MainLayout/MainLayout.tsx:2` (import swap)
- Modify: `src/components/Header/Header.tsx:2` (import swap)
- Modify: `src/hooks/useProductRoute/useProductRoute.tsx:1` (import swap)
- Modify: `src/hooks/useProductDetail/useProductDetail.tsx:3` (import swap)

**Interfaces:**
- Produces: `src/App.tsx` default-exports `App` which renders `<RouterProvider router={router} />`; the route tree is unchanged (`/`, `/categories`, `/products/:id`, `/cart`, `/checkout`, `/order/success`, all under `MainLayout`). Task 12 later moves this router to `src/app/router.tsx`.

- [ ] **Step 1: Swap the package**

```bash
npm uninstall react-router-dom
npm install react-router@8.3.0
```

- [ ] **Step 2: Convert App.tsx to data mode**

Replace the entire contents of `src/App.tsx` with:

```tsx
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
```

- [ ] **Step 3: Update remaining `react-router-dom` imports**

In each of these files change `from "react-router-dom"` to `from "react-router"` (imported names are unchanged):
- `src/Layouts/MainLayout/MainLayout.tsx` (`Outlet`)
- `src/components/Header/Header.tsx` (`Link`)
- `src/hooks/useProductRoute/useProductRoute.tsx` (`useNavigate`)
- `src/hooks/useProductDetail/useProductDetail.tsx` (`useParams`)

Then run: `grep -rn "react-router-dom" src/` — Expected: no matches.

- [ ] **Step 4: Build and smoke test**

Run: `npm run build`
Expected: PASS.

Run: `npm run dev` — click through all six routes (Home, Products, a product detail, Cart, Checkout, and place-order path can be skipped). Verify header links and product-card navigation work. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: migrate to react-router 8 data mode"
```

---

### Task 3: ESLint 10 + Prettier + import-x + TanStack Query plugin + `@/` alias

**Files:**
- Modify: `package.json` (dev deps + scripts)
- Modify: `eslint.config.js` (full rewrite below)
- Create: `.prettierrc.json`, `.prettierignore`
- Modify: `vite.config.ts` (alias)
- Modify: `tsconfig.app.json` (paths)

**Interfaces:**
- Produces: `npm run lint`, `npm run format`, `npm run format:check`, `npm run typecheck` scripts; `@/*` resolves to `src/*` in both Vite and TypeScript. Existing relative imports keep working — files migrate to `@/` as later tasks touch them.

- [ ] **Step 1: Upgrade/install lint + format packages**

```bash
npm uninstall eslint-plugin-import
npm install -D eslint@10.8.0 typescript-eslint@8.65.0 @eslint/js@latest globals@latest \
  eslint-plugin-react-hooks@latest eslint-plugin-react-refresh@latest \
  eslint-plugin-import-x@4.17.1 @tanstack/eslint-plugin-query@5.101.4 \
  prettier@3.9.6 eslint-config-prettier@latest
```

- [ ] **Step 2: Rewrite eslint.config.js**

Replace the entire contents of `eslint.config.js` with:

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importX from "eslint-plugin-import-x";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "coverage"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginQuery.configs["flat/recommended"],
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "import-x": importX,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "import-x/order": "error",
    },
  },
  prettierConfig
);
```

Note: if the upgraded `eslint-plugin-react-hooks` no longer exposes `configs.recommended.rules`, use its flat preset instead (check `npm view eslint-plugin-react-hooks` readme; the flat export is `configs["recommended-latest"]` in the 6/7 line) — keep the same two hook rules enabled.

- [ ] **Step 3: Add Prettier config**

Create `.prettierrc.json`:

```json
{}
```

Create `.prettierignore`:

```
dist
coverage
package-lock.json
```

- [ ] **Step 4: Add `@/` alias**

Replace the entire contents of `vite.config.ts` with:

```ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

In `tsconfig.app.json`, add inside `"compilerOptions"` (keep everything else):

```json
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
```

- [ ] **Step 5: Add scripts**

In `package.json` replace the `"scripts"` block with:

```json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc -b",
    "preview": "vite preview"
  },
```

- [ ] **Step 6: Format the repo and fix lint findings**

Run: `npm run format`
Run: `npm run lint`
Expected: `import-x/order` and query-plugin findings may appear. Fix `import-x/order` with `npx eslint . --fix`; fix any remaining findings by hand (they will be in the files this plan rewrites later — minimal fixes only).

Run: `npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: ESLint 10, Prettier, import-x, query lint plugin, @ alias"
```

---

### Task 4: Vitest + React Testing Library + MSW setup

**Files:**
- Modify: `package.json` (dev deps + test scripts), `vite.config.ts` (test block), `tsconfig.app.json` (vitest types)
- Create: `src/test/setup.ts`, `src/test/msw/server.ts`, `src/test/msw/handlers.ts`, `src/test/msw/fixtures.ts`, `src/test/utils.tsx`
- Test: `src/utils/pagination.utils.test.ts`, `src/utils/price.utils.test.ts`

**Interfaces:**
- Produces: `npm run test` / `npm run test:watch`; MSW `server` with dummyjson-shaped `handlers`; fixtures `makeProduct(overrides?)`, `makeProductsResponse(count, overrides?)`, `categories` (array of 3 `Category`); `createTestQueryClient()` and `renderWithClient(ui)` helpers in `src/test/utils.tsx`. All later test tasks consume these exact names.

- [ ] **Step 1: Install test packages**

```bash
npm install -D vitest@4.1.10 jsdom@30.0.1 @testing-library/react@16.3.2 \
  @testing-library/jest-dom@7.0.0 @testing-library/user-event@14.6.1 msw@2.15.0
```

- [ ] **Step 2: Configure Vitest**

In `vite.config.ts`, add the triple-slash reference as the first line and the `test` block:

```ts
/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
```

In `tsconfig.app.json` `"compilerOptions"`, add:

```json
    "types": ["vitest/globals"],
```

Add to `package.json` scripts:

```json
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 3: Create MSW fixtures**

Create `src/test/msw/fixtures.ts`:

```ts
import { Category, FetchProductsResponse, Product } from "@/types/product.type";

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
  overrides: Partial<FetchProductsResponse> = {}
): FetchProductsResponse {
  return {
    products: Array.from({ length: count }, (_, i) =>
      makeProduct({ id: i + 1, title: `Product ${i + 1}` })
    ),
    total: 100,
    skip: 0,
    limit: count,
    ...overrides,
  };
}

export const categories: Category[] = [
  { slug: "beauty", name: "Beauty", url: "https://dummyjson.com/products/category/beauty" },
  { slug: "fragrances", name: "Fragrances", url: "https://dummyjson.com/products/category/fragrances" },
  { slug: "furniture", name: "Furniture", url: "https://dummyjson.com/products/category/furniture" },
];
```

- [ ] **Step 4: Create MSW handlers and server**

Create `src/test/msw/handlers.ts` (note: the `/products/categories` handler MUST come before `/products/:id` — MSW matches in order):

```ts
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
          })
        ),
      })
    );
  }),

  http.get(`${BASE}/products/:id`, ({ params }) =>
    HttpResponse.json(makeProduct({ id: Number(params.id) }))
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
```

Create `src/test/msw/server.ts`:

```ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

- [ ] **Step 5: Create test setup and render helpers**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { server } from "./msw/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());
```

Create `src/test/utils.tsx`:

```tsx
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

export function createQueryWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}
```

- [ ] **Step 6: Write the first tests (utils)**

Create `src/utils/pagination.utils.test.ts`:

```ts
import { calculateOffset, calculateTotalPages } from "./pagination.utils";

describe("calculateOffset", () => {
  it("returns 0 for the first page", () => {
    expect(calculateOffset(1, 20)).toBe(0);
  });

  it("returns limit * (page - 1) for later pages", () => {
    expect(calculateOffset(3, 20)).toBe(40);
  });
});

describe("calculateTotalPages", () => {
  it("rounds up partial pages", () => {
    expect(calculateTotalPages(101, 20)).toBe(6);
  });

  it("handles exact division", () => {
    expect(calculateTotalPages(100, 20)).toBe(5);
  });
});
```

Create `src/utils/price.utils.test.ts`:

```ts
import { calculateOriginalPrice } from "./price.utlls";

describe("calculateOriginalPrice", () => {
  it("computes the pre-discount price", () => {
    expect(calculateOriginalPrice(90, 10)).toBeCloseTo(100);
  });

  it("returns the price unchanged when there is no discount", () => {
    expect(calculateOriginalPrice(50, undefined)).toBe(50);
    expect(calculateOriginalPrice(50, 0)).toBe(50);
    expect(calculateOriginalPrice(50, 100)).toBe(50);
  });
});
```

- [ ] **Step 7: Run tests**

Run: `npm run test`
Expected: 2 files, 6 tests, all PASS.

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "test: add Vitest + RTL + MSW infrastructure and utils tests"
```

---

### Task 5: Replace yup with zod

**Files:**
- Create: `src/components/CheckoutAddressForm/checkoutAddress.schema.ts`
- Test: `src/components/CheckoutAddressForm/checkoutAddress.schema.test.ts`
- Modify: `src/components/CheckoutAddressForm/CheckoutAddressForm.tsx`
- Modify: `package.json` (swap deps)

**Interfaces:**
- Produces: `checkoutAddressSchema` (zod object: address, email, phone — all required strings, email validated) and `CheckoutAddressFormData = z.infer<typeof checkoutAddressSchema>` exported from `checkoutAddress.schema.ts`. `CheckoutAddressForm.tsx` re-exports `CheckoutAddressFormData` so existing importers (`useCheckout.ts`, `CheckoutAddressBox`) keep working unchanged.

- [ ] **Step 1: Swap packages**

```bash
npm uninstall yup
npm install zod@4.4.3
npm install -D @hookform/resolvers@5.7.1 react-hook-form@latest
```

(`@hookform/resolvers` is a runtime dep in this project's package.json — keep it wherever npm puts it, just ensure the version is 5.7.1.)

- [ ] **Step 2: Write the failing schema test**

Create `src/components/CheckoutAddressForm/checkoutAddress.schema.test.ts`:

```ts
import { checkoutAddressSchema } from "./checkoutAddress.schema";

describe("checkoutAddressSchema", () => {
  const valid = {
    address: "1 Main St",
    email: "jane@example.com",
    phone: "0812345678",
  };

  it("accepts valid data", () => {
    expect(checkoutAddressSchema.safeParse(valid).success).toBe(true);
  });

  it("requires address", () => {
    const result = checkoutAddressSchema.safeParse({ ...valid, address: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Address is required");
  });

  it("rejects an invalid email", () => {
    const result = checkoutAddressSchema.safeParse({ ...valid, email: "nope" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Enter a valid email address"
    );
  });

  it("requires phone", () => {
    const result = checkoutAddressSchema.safeParse({ ...valid, phone: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Phone number is required");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- checkoutAddress`
Expected: FAIL — cannot resolve `./checkoutAddress.schema`.

- [ ] **Step 4: Write the schema**

Create `src/components/CheckoutAddressForm/checkoutAddress.schema.ts`:

```ts
import { z } from "zod";

export const checkoutAddressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z.string().min(1, "Phone number is required"),
});

export type CheckoutAddressFormData = z.infer<typeof checkoutAddressSchema>;
```

(zod 4: `z.email()` is the standalone email schema; `.pipe()` runs it after the required check so empty → "Email is required", non-email → "Enter a valid email address".)

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- checkoutAddress`
Expected: 4 tests PASS.

- [ ] **Step 6: Swap the resolver in the form**

In `src/components/CheckoutAddressForm/CheckoutAddressForm.tsx`:
- Delete the `yup` and `yupResolver` imports and the inline `validationSchema`/`CheckoutAddressFormData` definitions (lines 3–12 and 18–26 of the current file).
- Add at the top:

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutAddressSchema,
  CheckoutAddressFormData,
} from "./checkoutAddress.schema";

export type { CheckoutAddressFormData };
```

- Change the `useForm` call to:

```tsx
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutAddressFormData>({
    resolver: zodResolver(checkoutAddressSchema),
  });
```

The JSX and `onFormSubmit` stay unchanged.

- [ ] **Step 7: Verify**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS. Browser check: `/checkout` — submit the address form empty (three error messages appear), then with a bad email, then valid (address box shows the saved address).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: replace yup with zod for checkout address validation"
```

---

## Phase 2 — Data layer

### Task 6: Shared API client with normalized errors + QueryClient defaults

**Files:**
- Create: `src/shared/api/client.ts`
- Test: `src/shared/api/client.test.ts`
- Modify: `src/main.tsx` (QueryClient defaults)

**Interfaces:**
- Produces: `apiClient` (axios instance, baseURL from `VITE_API_BASE_URL`) and `class ApiError extends Error { status?: number }`, both exported from `@/shared/api/client`. Every rejected request from `apiClient` is an `ApiError` whose message comes from the server's `message` field when present. Tasks 7 and 11 consume `apiClient`.

- [ ] **Step 1: Write the failing tests**

Create `src/shared/api/client.test.ts`:

```ts
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw/server";
import { ApiError, apiClient } from "./client";

describe("apiClient", () => {
  it("returns response data on success", async () => {
    const { data } = await apiClient.get("/products/1");
    expect(data.id).toBe(1);
  });

  it("normalizes server errors into ApiError with the server message", async () => {
    server.use(
      http.get("https://dummyjson.com/products/1", () =>
        HttpResponse.json({ message: "Product not found" }, { status: 404 })
      )
    );

    const error = await apiClient.get("/products/1").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Product not found");
    expect(error.status).toBe(404);
  });

  it("falls back to a generic message when the server sends none", async () => {
    server.use(
      http.get("https://dummyjson.com/products/1", () =>
        HttpResponse.json({}, { status: 500 })
      )
    );

    const error = await apiClient.get("/products/1").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Something went wrong. Please try again.");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- shared/api`
Expected: FAIL — cannot resolve `./client`.

- [ ] **Step 3: Implement the client**

Create `src/shared/api/client.ts`:

```ts
import axios, { AxiosError } from "axios";

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) =>
    Promise.reject(
      new ApiError(
        error.response?.data?.message ??
          "Something went wrong. Please try again.",
        error.response?.status
      )
    )
);
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- shared/api`
Expected: 3 tests PASS.

- [ ] **Step 5: Set QueryClient defaults**

In `src/main.tsx`, change the QueryClient construction to:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
```

- [ ] **Step 6: Verify and commit**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS.

```bash
git add -A
git commit -m "feat: add shared API client with normalized errors and query defaults"
```

---

### Task 7: Products API + query factories

**Files:**
- Create: `src/features/products/api.ts`, `src/features/products/queries.ts`
- Test: `src/features/products/queries.test.tsx`

**Interfaces:**
- Consumes: `apiClient` from `@/shared/api/client`; types from `@/types/product.type`; `calculateOffset` from `@/utils/pagination.utils`.
- Produces (consumed by Tasks 8–10 and 19):
  - `api.ts`: `getProducts(params?: ProductListParams): Promise<FetchProductsResponse>`, `getProductsByCategory(params: CategoryProductsParams): Promise<FetchProductsResponse>`, `getCategories(): Promise<Category[]>`, `getProduct(id: string | number): Promise<Product>`; interfaces `ProductListParams { page?: number; limit?: number }` and `CategoryProductsParams extends ProductListParams { category: string }`.
  - `queries.ts`: `productKeys` key factory and `productQueries.list(params?)`, `productQueries.byCategory(params)` (with `placeholderData: keepPreviousData`), `productQueries.categories()` (staleTime 5 min), `productQueries.detail(id)` — all built with `queryOptions()`.

- [ ] **Step 1: Write the failing tests**

Create `src/features/products/queries.test.tsx`:

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { createQueryWrapper } from "@/test/utils";
import { productQueries } from "./queries";

describe("productQueries", () => {
  it("list fetches products with the given limit", async () => {
    const { result } = renderHook(
      () => useQuery(productQueries.list({ limit: 5 })),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.products).toHaveLength(5);
  });

  it("byCategory fetches products for a category and page", async () => {
    const { result } = renderHook(
      () =>
        useQuery(
          productQueries.byCategory({ category: "beauty", page: 2, limit: 20 })
        ),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.skip).toBe(20);
    expect(result.current.data?.products[0]?.title).toBe("beauty product 21");
  });

  it("categories fetches the category list", async () => {
    const { result } = renderHook(
      () => useQuery(productQueries.categories()),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((c) => c.slug)).toEqual([
      "beauty",
      "fragrances",
      "furniture",
    ]);
  });

  it("detail fetches a single product", async () => {
    const { result } = renderHook(
      () => useQuery(productQueries.detail(7)),
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe(7);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- features/products`
Expected: FAIL — cannot resolve `./queries`.

- [ ] **Step 3: Implement api.ts**

Create `src/features/products/api.ts`:

```ts
import { apiClient } from "@/shared/api/client";
import {
  Category,
  FetchProductsResponse,
  Product,
} from "@/types/product.type";
import { calculateOffset } from "@/utils/pagination.utils";

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
    { params: { skip: calculateOffset(page, limit), limit } }
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
```

- [ ] **Step 4: Implement queries.ts**

Create `src/features/products/queries.ts`:

```ts
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
  list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
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
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test -- features/products`
Expected: 4 tests PASS.

- [ ] **Step 6: Verify and commit**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS.

```bash
git add -A
git commit -m "feat: add products API and query factories"
```

---

### Task 8: Home page onto declarative queries

**Files:**
- Modify: `src/pages/Home/Home.tsx` (full rewrite below)

**Interfaces:**
- Consumes: `productQueries` from `@/features/products/queries`.
- Produces: Home no longer imports `useProducts`. Rendering identical except each section now shows its own loading spinner.

- [ ] **Step 1: Rewrite Home.tsx**

Replace the entire contents of `src/pages/Home/Home.tsx` with:

```tsx
import React, { useMemo, useState } from "react";
import {
  faTruck,
  faVolumeHigh,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import { faClock, faCreditCard } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery } from "@tanstack/react-query";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import ImageZoom from "@/components/ImageZoom/ImageZoom";
import CategoryMenu from "@/components/CategoryMenu/CategoryMenu";
import ProductsList from "@/components/ProductsList/ProductsList";
import FeatureCard from "@/components/FeatureCard/FeatureCard";
import useProductRoute from "@/hooks/useProductRoute/useProductRoute";
import { productQueries } from "@/features/products/queries";
import { Category as CategoryType } from "@/types/product.type";
import styles from "./Home.module.scss";
import Banner from "./components/Banner/Banner";

const PRODUCTS_LIST_LIMIT = 12;

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType | null>(null);
  const { goToProductDetails } = useProductRoute();

  const { data: bestProductsData, isLoading: isBestProductsLoading } = useQuery(
    productQueries.list({ limit: 5 })
  );
  const { data: categories } = useQuery(productQueries.categories());

  const currentCategory = selectedCategory ?? categories?.[0] ?? null;

  const {
    data: categoryProducts,
    isLoading: isCategoryProductsLoading,
  } = useQuery({
    ...productQueries.byCategory({
      category: currentCategory?.slug ?? "",
      limit: PRODUCTS_LIST_LIMIT,
    }),
    enabled: currentCategory !== null,
  });

  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1); // Add 1 days

    return date.toISOString();
  }, []);

  const onProductClick = (productId: number) => {
    goToProductDetails(productId);
  };

  return (
    <>
      <div className="container">
        <Banner />
        <section className={`${styles.featureCardBox} pt-35 flex`}>
          <FeatureCard
            icon={faTruck}
            title="Free Shipping"
            description="Free Shipping World Wide"
          />
          <FeatureCard
            icon={faClock}
            title="24 X 7 service"
            description="Online service for 24 X 7"
          />
          <FeatureCard
            icon={faVolumeHigh}
            title="Festival offer"
            description="New online special festival offer"
          />
          <FeatureCard
            icon={faCreditCard}
            title="Online payment"
            description="New online special festival offer"
          />
        </section>

        <section className="pt-55">
          <div className="flex align-item-center mb-20">
            <h2 className="fs-24 m-0 mr-15">
              <FontAwesomeIcon icon={faBolt} className="mr-5" /> DEALS OF THE
              DAY
            </h2>
            <CountdownTimer targetDate={targetDate} />
          </div>
          <div className="flex gap-25">
            {isBestProductsLoading ? (
              <div className="text-center">
                <ClipLoader
                  size={40}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <ProductsList
                products={bestProductsData?.products}
                onProductClick={onProductClick}
              />
            )}
          </div>
        </section>

        <section className="pt-65">
          <div className="flex gap-25">
            <div className={styles.mainDealBox}>
              <ImageZoom src="/images/deals/01.png" alt="deal 1" />
            </div>
            <div className={styles.secondDealBox}>
              <ImageZoom
                src="/images/deals/02.png"
                alt="deal 2"
                className="mb-20"
              />
              <ImageZoom src="/images/deals/03.png" alt="deal 3" />
            </div>
            <div className={styles.thirdDealBox}>
              <ImageZoom src="/images/deals/04.png" alt="deal 4" />
            </div>
          </div>
        </section>

        <section className="pt-65">
          <div className="flex gap-25">
            <CategoryMenu
              activeCategory={currentCategory?.slug}
              categories={categories || []}
              onCategoryClick={setSelectedCategory}
            />
            <div className="category-list-container category-list-box">
              {isCategoryProductsLoading ? (
                <div className="text-center">
                  <ClipLoader
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <ProductsList
                  products={categoryProducts?.products}
                  onProductClick={onProductClick}
                />
              )}
            </div>
          </div>
        </section>

        <section className="pt-60 pb-30">
          <ImageZoom
            src="/images/banners/03.png"
            alt="banner long"
            className="mb-20 "
          />
        </section>
      </div>
    </>
  );
};

export default Home;
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS.

Browser: Home shows 5 deal products, the category menu selects categories and swaps the 12-product grid, product click navigates.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: Home page uses declarative product queries"
```

---

### Task 9: Category page onto declarative queries; delete useProducts

**Files:**
- Modify: `src/pages/Category/Category.tsx` (full rewrite below)
- Delete: `src/hooks/useProducts/` (entire directory)

**Interfaces:**
- Consumes: `productQueries` from `@/features/products/queries`, `calculateTotalPages` from `@/utils/pagination.utils`.
- Produces: pagination derives from the query response (`data.total`); `useProducts` is gone from the codebase.

- [ ] **Step 1: Rewrite Category.tsx**

Replace the entire contents of `src/pages/Category/Category.tsx` with:

```tsx
import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery } from "@tanstack/react-query";
import CategoryMenu from "@/components/CategoryMenu/CategoryMenu";
import ProductsList from "@/components/ProductsList/ProductsList";
import Pagination from "@/components/Pagination/Pagination";
import { calculateTotalPages } from "@/utils/pagination.utils";
import useProductRoute from "@/hooks/useProductRoute/useProductRoute";
import { productQueries } from "@/features/products/queries";
import { Category as CategoryType } from "@/types/product.type";
import CategoryBanner from "./components/CategoryBanner/CategoryBanner";

const PAGE_LIMIT = 20;

const Category: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType | null>(null);
  const [page, setPage] = useState(1);
  const { goToProductDetails } = useProductRoute();

  const { data: categories } = useQuery(productQueries.categories());
  const currentCategory = selectedCategory ?? categories?.[0] ?? null;

  const { data, isLoading } = useQuery({
    ...productQueries.byCategory({
      category: currentCategory?.slug ?? "",
      page,
      limit: PAGE_LIMIT,
    }),
    enabled: currentCategory !== null,
  });

  const totalPages = data ? calculateTotalPages(data.total, PAGE_LIMIT) : 0;

  const onCategoryClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const onProductClick = (productId: number) => {
    goToProductDetails(productId);
  };

  return (
    <>
      <CategoryBanner name={currentCategory?.name} />
      <div className="container pt-60 pb-60">
        <section>
          <div className="flex gap-25">
            <CategoryMenu
              activeCategory={currentCategory?.slug}
              categories={categories || []}
              onCategoryClick={onCategoryClick}
            />
            <div className="category-list-container">
              {isLoading ? (
                <div className="text-center">
                  <ClipLoader
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <>
                  <div className="category-list-box mb-30">
                    <ProductsList
                      products={data?.products}
                      onProductClick={onProductClick}
                    />
                  </div>
                  {totalPages > 0 && (
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Category;
```

- [ ] **Step 2: Delete the old hook**

```bash
rm -rf src/hooks/useProducts
grep -rn "useProducts" src/
```

Expected: no matches.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS.

Browser: `/categories` — switching categories resets to page 1; pagination pages through without flashing empty (keepPreviousData); banner shows the category name.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: Category page uses declarative queries with derived pagination"
```

---

### Task 10: Product detail onto declarative query; delete useProductDetail

**Files:**
- Modify: `src/pages/Product/Product.tsx` (top section changes below)
- Delete: `src/hooks/useProductDetail/` (entire directory)

**Interfaces:**
- Consumes: `productQueries.detail` from `@/features/products/queries`; `useParams` from `react-router`.
- Produces: `useProductDetail` gone from the codebase.

- [ ] **Step 1: Swap the hook usage**

In `src/pages/Product/Product.tsx`, replace the imports of `useProductDetail` and the hook call. The top of the file becomes:

```tsx
import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import CategoryBanner from "@/pages/Category/components/CategoryBanner/CategoryBanner";
import ProductImageGallery from "@/components/ProductImageGallery/ProductImageGallery";
import { calculateOriginalPrice } from "@/utils/price.utlls";
import ProductDetailInfo from "@/components/ProductDetailInfo/ProductDetailInfo";
import AddToCartModalContent from "@/components/AddToCartModalContent/AddToCartModalContent";
import { useCart } from "@/hooks/useCart/useCart";
import { productQueries } from "@/features/products/queries";
import ReviewSection from "./components/ReviewSection";

const Product: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { data: productDetail, isLoading } = useQuery({
    ...productQueries.detail(id ?? ""),
    enabled: !!id,
  });
  const { addToCart } = useCart();
```

Everything from `const onOpenModal = ...` down stays unchanged.

- [ ] **Step 2: Delete the old hook**

```bash
rm -rf src/hooks/useProductDetail
grep -rn "useProductDetail" src/
```

Expected: no matches.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS.

Browser: open a product from Home — detail renders, Add to Cart opens the modal, revisiting the same product is instant (cache).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: Product page uses declarative detail query"
```

---

### Task 11: Checkout API extraction

**Files:**
- Create: `src/features/checkout/api.ts`
- Modify: `src/pages/Checkout/hooks/useCheckout.ts`

**Interfaces:**
- Consumes: `apiClient` from `@/shared/api/client`; `CheckoutAddressFormData` from the form component.
- Produces: `placeOrder(payload: PlaceOrderPayload): Promise<PlaceOrderResponse>` with `PlaceOrderPayload { userId: number; products: { id: number; quantity: number }[]; address: CheckoutAddressFormData }` and `PlaceOrderResponse { id: number }` from `@/features/checkout/api`. Task 17 adds cart clearing to this flow.

- [ ] **Step 1: Create the checkout API module**

Create `src/features/checkout/api.ts`:

```ts
import { apiClient } from "@/shared/api/client";
import { CheckoutAddressFormData } from "@/components/CheckoutAddressForm/CheckoutAddressForm";

export interface PlaceOrderPayload {
  userId: number;
  products: { id: number; quantity: number }[];
  address: CheckoutAddressFormData;
}

export interface PlaceOrderResponse {
  id: number;
}

export async function placeOrder(
  payload: PlaceOrderPayload
): Promise<PlaceOrderResponse> {
  const { data } = await apiClient.post<PlaceOrderResponse>(
    "/carts/add",
    payload
  );
  return data;
}
```

- [ ] **Step 2: Use it in useCheckout**

In `src/pages/Checkout/hooks/useCheckout.ts`:
- Remove `import axios from "axios";` and `import { config } from "../../../configs/environment";`.
- Add `import { placeOrder } from "@/features/checkout/api";`.
- Delete the local `placeOrder` function (lines 55–66 of the current file).
- Change the mutation to:

```ts
  const { mutate: placeOrderMutate, isPending: isPlaceOrderLoading } =
    useMutation({
      mutationFn: () => {
        if (!checkoutAddress) {
          throw new Error("Delivery Address is Missing");
        }

        return placeOrder({
          userId: 1,
          products: cart.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          address: checkoutAddress,
        });
      },
      onSuccess: () => {
        goToOrderSuccess();
      },
    });
```

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS. Also: `grep -rn "axios" src/ --include="*.ts*" | grep -v shared/api` — Expected: no matches (all HTTP goes through the client).

Browser: add an item, checkout with a valid address, place order → lands on `/order/success`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: extract checkout placeOrder API"
```

---

## Phase 3 — Feature-based restructure

Restructure procedure for Tasks 12–14: move with `git mv` (history preserved), then run `npm run typecheck` — the compiler lists every broken import; update each to the new `@/` path. A task is done only when typecheck, lint, tests, and build all pass.

### Task 12: App shell (`src/app/`)

**Files:**
- Create: `src/app/App.tsx`, `src/app/router.tsx`, `src/app/providers.tsx`, `src/app/queryClient.ts`
- Move: `src/Layouts/MainLayout/*` → `src/app/layouts/MainLayout/*`
- Modify: `src/main.tsx`
- Delete: `src/App.tsx`, `src/Layouts/`

**Interfaces:**
- Produces: `src/app/router.tsx` exports `routes` (the route object array — Task 19's tests build a memory router from it) and `router`; `src/app/providers.tsx` exports `AppProviders`; `src/app/queryClient.ts` exports `queryClient`. `src/main.tsx` renders `<App />` only.

- [ ] **Step 1: Install devtools**

```bash
npm install -D @tanstack/react-query-devtools@5.101.4
```

- [ ] **Step 2: Move the layout**

```bash
mkdir -p src/app/layouts
git mv src/Layouts/MainLayout src/app/layouts/MainLayout
rmdir src/Layouts 2>/dev/null || true
```

- [ ] **Step 3: Create the shell files**

Create `src/app/queryClient.ts`:

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
```

Create `src/app/providers.tsx`:

```tsx
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CartProvider } from "@/contexts/cart/CartProvider";
import { queryClient } from "./queryClient";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</CartProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

Create `src/app/router.tsx`:

```tsx
import { createBrowserRouter, RouteObject } from "react-router";
import MainLayout from "@/app/layouts/MainLayout/MainLayout";
import Home from "@/pages/Home/Home";
import Category from "@/pages/Category/Category";
import Product from "@/pages/Product/Product";
import Cart from "@/pages/Cart/Cart";
import Checkout from "@/pages/Checkout/Checkout";
import OrderSuccess from "@/pages/Order/OrderSuccess";

export const routes: RouteObject[] = [
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
];

export const router = createBrowserRouter(routes);
```

Create `src/app/App.tsx`:

```tsx
import { RouterProvider } from "react-router/dom";
import { AppProviders } from "./providers";
import { router } from "./router";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
```

Replace the entire contents of `src/main.tsx` with:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import "react-loading-skeleton/dist/skeleton.css";
import App from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Delete the old `src/App.tsx`:

```bash
git rm src/App.tsx
```

- [ ] **Step 4: Fix imports and verify**

Run: `npm run typecheck` — fix any imports still pointing at `src/Layouts/` (use `@/app/layouts/MainLayout/MainLayout`).
Run: `npm run build && npm run lint && npm run test`
Expected: PASS. Browser: all routes render; Query Devtools toggle appears in dev.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: extract app shell (providers, router, queryClient, layout)"
```

---

### Task 13: Move products feature + shared modules

**Files (move map — `git mv` each):**

| From | To |
|---|---|
| `src/types/product.type.ts` | `src/features/products/types.ts` |
| `src/components/ProductCard/` | `src/features/products/components/ProductCard/` |
| `src/components/ProductsList/` | `src/features/products/components/ProductsList/` |
| `src/components/CategoryMenu/` | `src/features/products/components/CategoryMenu/` |
| `src/components/ProductDetailInfo/` | `src/features/products/components/ProductDetailInfo/` |
| `src/components/ProductImageGallery/` | `src/features/products/components/ProductImageGallery/` |
| `src/components/ReviewCard/` | `src/features/products/components/ReviewCard/` |
| `src/components/RatingBreakdown/` | `src/features/products/components/RatingBreakdown/` |
| `src/components/StarReview/` | `src/shared/components/StarReview/` |
| `src/components/Button/` | `src/shared/components/Button/` |
| `src/components/Input/` | `src/shared/components/Input/` |
| `src/components/RadioInput/` | `src/shared/components/RadioInput/` |
| `src/components/Modal/` | `src/shared/components/Modal/` |
| `src/components/Pagination/` | `src/shared/components/Pagination/` |
| `src/components/ImageZoom/` | `src/shared/components/ImageZoom/` |
| `src/components/SwiperCarousel/` | `src/shared/components/SwiperCarousel/` |
| `src/components/CountdownTimer/` | `src/shared/components/CountdownTimer/` |
| `src/components/FeatureCard/` | `src/shared/components/FeatureCard/` |
| `src/components/Header/` | `src/shared/components/Header/` |
| `src/components/Footer/` | `src/shared/components/Footer/` |
| `src/utils/price.utlls.ts` | `src/shared/utils/price.utils.ts` (typo fixed) |
| `src/utils/pagination.utils.ts` | `src/shared/utils/pagination.utils.ts` |
| `src/utils/price.utils.test.ts` | `src/shared/utils/price.utils.test.ts` |
| `src/utils/pagination.utils.test.ts` | `src/shared/utils/pagination.utils.test.ts` |
| `src/types/generic.type.ts` | `src/shared/types/generic.type.ts` |
| `src/types/global.d.ts` | `src/shared/types/global.d.ts` |
| `src/hooks/useProductRoute/useProductRoute.tsx` | `src/shared/hooks/useProductRoute.tsx` |

**Interfaces:**
- Produces: `@/features/products/types` exports Product/Category/FetchProductsResponse; `@/shared/utils/price.utils` exports `calculateOriginalPrice`; `@/shared/hooks/useProductRoute` default-exports the hook. All import paths across `src/` updated to `@/...` for moved modules.

- [ ] **Step 1: Execute the moves**

```bash
mkdir -p src/features/products/components src/shared/components src/shared/utils src/shared/types src/shared/hooks
git mv src/types/product.type.ts src/features/products/types.ts
for c in ProductCard ProductsList CategoryMenu ProductDetailInfo ProductImageGallery ReviewCard RatingBreakdown; do git mv "src/components/$c" "src/features/products/components/$c"; done
for c in StarReview Button Input RadioInput Modal Pagination ImageZoom SwiperCarousel CountdownTimer FeatureCard Header Footer; do git mv "src/components/$c" "src/shared/components/$c"; done
git mv src/utils/price.utlls.ts src/shared/utils/price.utils.ts
git mv src/utils/pagination.utils.ts src/shared/utils/pagination.utils.ts
git mv src/utils/price.utils.test.ts src/shared/utils/price.utils.test.ts
git mv src/utils/pagination.utils.test.ts src/shared/utils/pagination.utils.test.ts
git mv src/types/generic.type.ts src/shared/types/generic.type.ts
git mv src/types/global.d.ts src/shared/types/global.d.ts
git mv src/hooks/useProductRoute/useProductRoute.tsx src/shared/hooks/useProductRoute.tsx
rmdir src/hooks/useProductRoute 2>/dev/null || true
```

- [ ] **Step 2: Fix every broken import**

Run: `npm run typecheck` repeatedly; update each reported import to the new `@/` path (e.g. `@/features/products/types`, `@/shared/components/Button/Button`, `@/shared/utils/price.utils`, `@/shared/hooks/useProductRoute`). Also update the two moved test files' own imports (`./pagination.utils`, `./price.utils` — note the fixed spelling). In `tsconfig.app.json`, `"typeRoots"` includes `./src/types` — change that entry to `./src/shared/types`.

Expected end state: `npm run typecheck` clean; `grep -rn '"\.\./' src/pages src/features src/shared src/app | grep -v module.scss` shows no cross-directory relative imports.

- [ ] **Step 3: Verify and commit**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS. Browser smoke: Home, Categories, product detail all render styled.

```bash
git add -A
git commit -m "refactor: move products feature and shared modules into place"
```

---

### Task 14: Move cart + checkout features; delete legacy dirs

**Files (move map — `git mv` each):**

| From | To |
|---|---|
| `src/contexts/cart/CartContext.tsx` | `src/features/cart/store/CartContext.tsx` |
| `src/contexts/cart/CartProvider.tsx` | `src/features/cart/store/CartProvider.tsx` |
| `src/hooks/useCart/useCart.tsx` | `src/features/cart/useCart.ts` |
| `src/components/CartTable/` | `src/features/cart/components/CartTable/` |
| `src/components/CartSummary/` | `src/features/cart/components/CartSummary/` |
| `src/components/AddToCartModalContent/` | `src/features/cart/components/AddToCartModalContent/` |
| `src/components/SummaryOrderItem/` | `src/features/cart/components/SummaryOrderItem/` |
| `src/components/CheckoutAddressBox/` | `src/features/checkout/components/CheckoutAddressBox/` |
| `src/components/CheckoutAddressForm/` | `src/features/checkout/components/CheckoutAddressForm/` |
| `src/components/CheckoutDeliveryBox/` | `src/features/checkout/components/CheckoutDeliveryBox/` |
| `src/components/CheckoutPaymentBox/` | `src/features/checkout/components/CheckoutPaymentBox/` |
| `src/components/BillingSummary/` | `src/features/checkout/components/BillingSummary/` |
| `src/components/DeliveryOption/` | `src/features/checkout/components/DeliveryOption/` |
| `src/components/PaymentOption/` | `src/features/checkout/components/PaymentOption/` |
| `src/components/SummaryOrder/` | `src/features/checkout/components/SummaryOrder/` |
| `src/pages/Checkout/hooks/useCheckout.ts` | `src/features/checkout/useCheckout.ts` |
| `src/components/CheckoutAddressForm/checkoutAddress.schema.ts` (moves with its dir) | `src/features/checkout/schema.ts` (then `git mv` out of the component dir) |
| `src/consts/checkout.const.ts` | `src/features/checkout/consts.ts` |
| `src/types/checkout.type.ts` | `src/features/checkout/types.ts` |

**Interfaces:**
- Produces: `@/features/cart/useCart` exports `useCart`; `@/features/checkout/schema` exports `checkoutAddressSchema` + `CheckoutAddressFormData`; `@/features/checkout/useCheckout` default-exports the hook; `@/features/checkout/consts` exports `deliveryOptions`/`paymentOptions`; `@/features/checkout/types` exports `DeliveryOption`/`PaymentOption`. Legacy dirs `src/contexts/`, `src/hooks/`, `src/consts/`, `src/components/`, `src/configs/`, `src/types/`, `src/utils/` no longer exist.

- [ ] **Step 1: Execute the moves**

```bash
mkdir -p src/features/cart/store src/features/cart/components src/features/checkout/components
git mv src/contexts/cart/CartContext.tsx src/features/cart/store/CartContext.tsx
git mv src/contexts/cart/CartProvider.tsx src/features/cart/store/CartProvider.tsx
git mv src/hooks/useCart/useCart.tsx src/features/cart/useCart.ts
for c in CartTable CartSummary AddToCartModalContent SummaryOrderItem; do git mv "src/components/$c" "src/features/cart/components/$c"; done
for c in CheckoutAddressBox CheckoutAddressForm CheckoutDeliveryBox CheckoutPaymentBox BillingSummary DeliveryOption PaymentOption SummaryOrder; do git mv "src/components/$c" "src/features/checkout/components/$c"; done
git mv src/features/checkout/components/CheckoutAddressForm/checkoutAddress.schema.ts src/features/checkout/schema.ts
git mv src/features/checkout/components/CheckoutAddressForm/checkoutAddress.schema.test.ts src/features/checkout/schema.test.ts
git mv src/pages/Checkout/hooks/useCheckout.ts src/features/checkout/useCheckout.ts
git mv src/consts/checkout.const.ts src/features/checkout/consts.ts
git mv src/types/checkout.type.ts src/features/checkout/types.ts
git rm src/configs/environment.ts
rm -rf src/contexts src/hooks src/consts src/components src/configs src/types src/utils src/pages/Checkout/hooks
```

(`useCart.tsx` → `.ts` is fine — it contains no JSX. `configs/environment.ts` is deleted because `apiClient` reads the env var directly. The `rm -rf` list must be empty directories by this point — if any file remains, a move above was missed; investigate before deleting.)

- [ ] **Step 2: Fix every broken import**

Run: `npm run typecheck` repeatedly; update to `@/features/cart/...`, `@/features/checkout/...` paths. `schema.ts`/`schema.test.ts` internal import becomes `./schema`. `CheckoutAddressForm.tsx` imports the schema from `@/features/checkout/schema`.

Expected: typecheck clean; `grep -rn "configs/environment" src/` — no matches.

- [ ] **Step 3: Verify and commit**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS. Browser smoke: full flow Home → product → add to cart → cart → checkout → place order.

```bash
git add -A
git commit -m "refactor: move cart and checkout features into place"
```

---

## Phase 4 — Cart fixes, error states, tests

### Task 15: Extract cartReducer + implement CLEAR_CART (TDD)

**Files:**
- Create: `src/features/cart/store/cartReducer.ts`
- Test: `src/features/cart/store/cartReducer.test.ts`
- Modify: `src/features/cart/store/CartProvider.tsx`, `src/features/cart/store/CartContext.tsx`

**Interfaces:**
- Consumes: `CartActionTypes`, `CartItem`, `CartState` from `./CartContext`.
- Produces: `cartReducer(state: CartState, action: CartAction): CartState` and `type CartAction` exported from `@/features/cart/store/cartReducer`; `CartContextProps` gains `clearCart: () => void`; `CartProvider` provides it. Task 17 consumes `clearCart`.

- [ ] **Step 1: Write the failing tests**

Create `src/features/cart/store/cartReducer.test.ts`:

```ts
import { CartActionTypes, CartItem, CartState } from "./CartContext";
import { cartReducer } from "./cartReducer";

const item = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 1,
  title: "Widget",
  price: 10,
  quantity: 1,
  image: "/widget.png",
  ...overrides,
});

const stateWith = (...items: CartItem[]): CartState => ({ items });

describe("cartReducer", () => {
  it("adds a new item", () => {
    const next = cartReducer(stateWith(), {
      type: CartActionTypes.ADD_TO_CART,
      payload: item(),
    });
    expect(next.items).toEqual([item()]);
  });

  it("merges quantity when the item already exists", () => {
    const next = cartReducer(stateWith(item({ quantity: 2 })), {
      type: CartActionTypes.ADD_TO_CART,
      payload: item({ quantity: 3 }),
    });
    expect(next.items).toEqual([item({ quantity: 5 })]);
  });

  it("removes an item", () => {
    const next = cartReducer(stateWith(item(), item({ id: 2 })), {
      type: CartActionTypes.REMOVE_FROM_CART,
      payload: { id: 1 },
    });
    expect(next.items).toEqual([item({ id: 2 })]);
  });

  it("updates quantity", () => {
    const next = cartReducer(stateWith(item()), {
      type: CartActionTypes.UPDATE_QUANTITY,
      payload: { id: 1, quantity: 7 },
    });
    expect(next.items[0]?.quantity).toBe(7);
  });

  it("clears the cart", () => {
    const next = cartReducer(stateWith(item(), item({ id: 2 })), {
      type: CartActionTypes.CLEAR_CART,
    });
    expect(next.items).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- cartReducer`
Expected: FAIL — cannot resolve `./cartReducer`.

- [ ] **Step 3: Implement the reducer**

Create `src/features/cart/store/cartReducer.ts` — move the existing reducer and action type out of `CartProvider.tsx` verbatim, adding the CLEAR_CART variant:

```ts
import { CartActionTypes, CartItem, CartState } from "./CartContext";

export type CartAction =
  | { type: CartActionTypes.ADD_TO_CART; payload: CartItem }
  | { type: CartActionTypes.REMOVE_FROM_CART; payload: { id: number } }
  | {
      type: CartActionTypes.UPDATE_QUANTITY;
      payload: { id: number; quantity: number };
    }
  | { type: CartActionTypes.CLEAR_CART };

export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  switch (action.type) {
    case CartActionTypes.ADD_TO_CART: {
      const {
        id,
        title,
        price,
        quantity = 1,
        image,
        originalPrice,
      } = action.payload;

      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          { id, title, price, quantity, image, originalPrice },
        ],
      };
    }
    case CartActionTypes.REMOVE_FROM_CART: {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }
    case CartActionTypes.UPDATE_QUANTITY: {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case CartActionTypes.CLEAR_CART: {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- cartReducer`
Expected: 5 tests PASS.

- [ ] **Step 5: Wire clearCart through context and provider**

In `src/features/cart/store/CartContext.tsx`, add to `CartContextProps`:

```ts
  clearCart: () => void;
```

Replace the entire contents of `src/features/cart/store/CartProvider.tsx` with:

```tsx
import React, { useReducer } from "react";
import { CartActionTypes, CartContext, CartItem, CartState } from "./CartContext";
import { cartReducer } from "./cartReducer";

const initialState: CartState = {
  items: [],
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item: CartItem) => {
    dispatch({ type: CartActionTypes.ADD_TO_CART, payload: item });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: CartActionTypes.REMOVE_FROM_CART, payload: { id } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({
      type: CartActionTypes.UPDATE_QUANTITY,
      payload: { id, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CartActionTypes.CLEAR_CART });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
```

- [ ] **Step 6: Verify and commit**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS.

```bash
git add -A
git commit -m "feat: extract cartReducer and implement CLEAR_CART"
```

---

### Task 16: Cart localStorage persistence (TDD)

**Files:**
- Create: `src/features/cart/store/cartStorage.ts`
- Test: `src/features/cart/store/cartStorage.test.ts`
- Modify: `src/features/cart/store/CartProvider.tsx`

**Interfaces:**
- Produces: `loadCartState(): CartState` and `saveCartState(state: CartState): void` from `@/features/cart/store/cartStorage`, storage key `"ecommerce-cart:v1"`. `CartProvider` initializes from storage and writes through on every change.

- [ ] **Step 1: Write the failing tests**

Create `src/features/cart/store/cartStorage.test.ts`:

```ts
import { CartState } from "./CartContext";
import { CART_STORAGE_KEY, loadCartState, saveCartState } from "./cartStorage";

const sample: CartState = {
  items: [
    { id: 1, title: "Widget", price: 10, quantity: 2, image: "/w.png" },
  ],
};

describe("cartStorage", () => {
  it("round-trips cart state", () => {
    saveCartState(sample);
    expect(loadCartState()).toEqual(sample);
  });

  it("returns an empty cart when nothing is stored", () => {
    expect(loadCartState()).toEqual({ items: [] });
  });

  it("returns an empty cart when stored JSON is corrupt", () => {
    localStorage.setItem(CART_STORAGE_KEY, "{not json");
    expect(loadCartState()).toEqual({ items: [] });
  });

  it("returns an empty cart when the stored shape is wrong", () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: "nope" }));
    expect(loadCartState()).toEqual({ items: [] });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- cartStorage`
Expected: FAIL — cannot resolve `./cartStorage`.

- [ ] **Step 3: Implement storage**

Create `src/features/cart/store/cartStorage.ts`:

```ts
import { CartState } from "./CartContext";

export const CART_STORAGE_KEY = "ecommerce-cart:v1";

const EMPTY: CartState = { items: [] };

export function loadCartState(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Array.isArray((parsed as CartState).items)
    ) {
      return parsed as CartState;
    }
    return EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveCartState(state: CartState): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — cart just won't persist.
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- cartStorage`
Expected: 4 tests PASS.

- [ ] **Step 5: Wire persistence into the provider**

In `src/features/cart/store/CartProvider.tsx`:
- Add imports: `useEffect` from react, `loadCartState, saveCartState` from `./cartStorage`.
- Change the reducer init to lazy-load and add write-through:

```tsx
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCartState);

  useEffect(() => {
    saveCartState(cart);
  }, [cart]);
```

(Remove the now-unused `initialState` constant.)

- [ ] **Step 6: Verify and commit**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS. Browser: add items to the cart, reload the page — cart contents survive.

```bash
git add -A
git commit -m "feat: persist cart to localStorage"
```

---

### Task 17: Clear cart after successful order + useCheckout tests

**Files:**
- Modify: `src/features/checkout/useCheckout.ts`
- Test: `src/features/checkout/useCheckout.test.tsx`

**Interfaces:**
- Consumes: `clearCart` from `useCart()` (Task 15), `placeOrder` (Task 11), MSW POST handler (Task 4).
- Produces: after a successful place-order mutation the cart is cleared and the router navigates to `/order/success`.

- [ ] **Step 1: Write the failing test**

Create `src/features/checkout/useCheckout.test.tsx`:

```tsx
import { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { createTestQueryClient } from "@/test/utils";
import { CartProvider } from "@/features/cart/store/CartProvider";
import { CART_STORAGE_KEY } from "@/features/cart/store/cartStorage";
import { useCart } from "@/features/cart/useCart";
import useCheckout from "./useCheckout";

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter initialEntries={["/checkout"]}>
      <QueryClientProvider client={createTestQueryClient()}>
        <CartProvider>{children}</CartProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe("useCheckout", () => {
  it("clears the cart after a successful order", async () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: [
          { id: 1, title: "Widget", price: 10, quantity: 2, image: "/w.png" },
        ],
      })
    );

    const { result } = renderHook(
      () => ({ checkout: useCheckout(), cart: useCart() }),
      { wrapper }
    );

    expect(result.current.cart.cart.items).toHaveLength(1);
    expect(result.current.checkout.billingSummary.subtotal).toBe(20);

    act(() => {
      result.current.checkout.storeCheckoutAddress({
        address: "1 Main St",
        email: "jane@example.com",
        phone: "0812345678",
      });
    });

    act(() => {
      result.current.checkout.onPlaceOrder();
    });

    await waitFor(() =>
      expect(result.current.cart.cart.items).toHaveLength(0)
    );
  });

  it("errors and keeps the cart when no address is set", async () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: [
          { id: 1, title: "Widget", price: 10, quantity: 2, image: "/w.png" },
        ],
      })
    );

    const { result } = renderHook(
      () => ({ checkout: useCheckout(), cart: useCart() }),
      { wrapper }
    );

    act(() => {
      result.current.checkout.onPlaceOrder();
    });

    await waitFor(() =>
      expect(result.current.checkout.isPlaceOrderLoading).toBe(false)
    );
    expect(result.current.cart.cart.items).toHaveLength(1);
  });
});
```

(The second test passes both before and after the change — it pins the guard behavior: no address → mutation errors, cart untouched.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- useCheckout`
Expected: FAIL — cart still has 1 item after the mutation (clearCart not called yet).

- [ ] **Step 3: Implement**

In `src/features/checkout/useCheckout.ts`:
- Destructure `clearCart` as well: `const { cart, clearCart } = useCart();`
- Change the mutation's `onSuccess` to:

```ts
      onSuccess: () => {
        clearCart();
        goToOrderSuccess();
      },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- useCheckout`
Expected: PASS.

- [ ] **Step 5: Verify and commit**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS. Browser: place an order — success page shows and the header cart badge is empty.

```bash
git add -A
git commit -m "feat: clear cart after successful order"
```

---

### Task 18: Inline error states + route error boundary

**Files:**
- Create: `src/shared/components/ErrorMessage/ErrorMessage.tsx`, `src/app/RouteErrorFallback.tsx`
- Modify: `src/app/router.tsx`, `src/pages/Home/Home.tsx`, `src/pages/Category/Category.tsx`, `src/pages/Product/Product.tsx`

**Interfaces:**
- Produces: `ErrorMessage({ message?: string })` shared component; root route gets `errorElement: <RouteErrorFallback />`; the three query-driven pages render `ErrorMessage` on query error.

- [ ] **Step 1: Create ErrorMessage**

Create `src/shared/components/ErrorMessage/ErrorMessage.tsx`:

```tsx
import React from "react";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "Something went wrong. Please try again.",
}) => {
  return (
    <div role="alert" className="text-center pt-30 pb-30">
      <p className="fs-18 text-muted">{message}</p>
    </div>
  );
};

export default ErrorMessage;
```

- [ ] **Step 2: Create the route error fallback and attach it**

Create `src/app/RouteErrorFallback.tsx`:

```tsx
import { isRouteErrorResponse, useRouteError } from "react-router";
import ErrorMessage from "@/shared/components/ErrorMessage/ErrorMessage";

export default function RouteErrorFallback() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Something went wrong. Please reload the page.";

  return (
    <div className="container pt-60 pb-60">
      <ErrorMessage message={message} />
    </div>
  );
}
```

In `src/app/router.tsx`, add to the root route object (the one with `element: <MainLayout />`):

```tsx
    errorElement: <RouteErrorFallback />,
```

with the import `import RouteErrorFallback from "./RouteErrorFallback";`.

- [ ] **Step 3: Add error states to the three pages**

- `src/pages/Product/Product.tsx`: destructure `isError` from the detail `useQuery`; after the `isLoading` block, change the `!productDetail` early return to:

```tsx
  if (isError || !productDetail) {
    return (
      <div className="container">
        <ErrorMessage message="We couldn't load this product. Please try again." />
      </div>
    );
  }
```

- `src/pages/Home/Home.tsx`: destructure `isError: isBestProductsError` from the list query and `isError: isCategoryProductsError` from the byCategory query. In the deals section render `<ErrorMessage />` when `isBestProductsError` (in place of the list), and in the category section render `<ErrorMessage />` when `isCategoryProductsError`.
- `src/pages/Category/Category.tsx`: destructure `isError` from the byCategory query; inside the products area render `<ErrorMessage />` when `isError` (in place of the list + pagination).

Each page imports: `import ErrorMessage from "@/shared/components/ErrorMessage/ErrorMessage";`

- [ ] **Step 4: Verify and commit**

Run: `npm run build && npm run lint && npm run test`
Expected: PASS. Browser check: temporarily set `VITE_API_BASE_URL=https://dummyjson.invalid` in `.env`, restart dev server — pages show the error message instead of infinite spinners; restore `.env` afterwards.

```bash
git add -A
git commit -m "feat: inline query error states and route error boundary"
```

---

### Task 19: Integration tests (Home, Category, Cart, Checkout)

**Files:**
- Create: `src/test/renderRoute.tsx`
- Test: `src/pages/Home/Home.test.tsx`, `src/pages/Category/Category.test.tsx`, `src/pages/Cart/Cart.test.tsx`, `src/pages/Checkout/Checkout.test.tsx`

**Interfaces:**
- Consumes: `routes` from `@/app/router` (Task 12), MSW fixtures/handlers (Task 4), `CART_STORAGE_KEY` (Task 16).
- Produces: `renderRoute(initialPath: string)` helper that renders the real route tree in a memory router with fresh providers.

- [ ] **Step 1: Create the route render helper**

Create `src/test/renderRoute.tsx`:

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "@/app/router";
import { CartProvider } from "@/features/cart/store/CartProvider";
import { createTestQueryClient } from "./utils";

export function renderRoute(initialPath: string) {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
  });

  return {
    router,
    ...render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </QueryClientProvider>
    ),
  };
}
```

- [ ] **Step 2: Home test**

Create `src/pages/Home/Home.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { renderRoute } from "@/test/renderRoute";

describe("Home page", () => {
  it("renders deal products and category products from the API", async () => {
    renderRoute("/");

    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(
      await screen.findByText("beauty product 1")
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Category test**

Create `src/pages/Category/Category.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "@/test/renderRoute";

describe("Category page", () => {
  it("switches category and pages through results", async () => {
    const user = userEvent.setup();
    renderRoute("/categories");

    expect(await screen.findByText("beauty product 1")).toBeInTheDocument();

    await user.click(screen.getByText("Fragrances"));
    expect(
      await screen.findByText("fragrances product 1")
    ).toBeInTheDocument();

    await user.click(screen.getByText("2"));
    expect(
      await screen.findByText("fragrances product 21")
    ).toBeInTheDocument();
  });
});
```

(Selector confirmed: `CategoryMenu` renders each `category.name` as clickable text; ReactPaginate renders page links with text "2".)

- [ ] **Step 4: Cart test**

Create `src/pages/Cart/Cart.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CART_STORAGE_KEY } from "@/features/cart/store/cartStorage";
import { renderRoute } from "@/test/renderRoute";

function seedCart() {
  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify({
      items: [
        { id: 1, title: "Widget", price: 10, quantity: 1, image: "/w.png" },
      ],
    })
  );
}

describe("Cart page", () => {
  it("shows the empty state when there are no items", async () => {
    renderRoute("/cart");
    expect(
      await screen.findByText("Your Cart is Empty")
    ).toBeInTheDocument();
  });

  it("updates quantity and total", async () => {
    const user = userEvent.setup();
    seedCart();
    renderRoute("/cart");

    expect(await screen.findByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("Total Price: $10.00")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: ">" }));
    expect(screen.getByText("Total Price: $20.00")).toBeInTheDocument();
  });

  it("removes an item", async () => {
    const user = userEvent.setup();
    seedCart();
    renderRoute("/cart");

    await user.click(await screen.findByRole("button", { name: "×" }));
    expect(
      await screen.findByText("Your Cart is Empty")
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Checkout happy-path test**

Create `src/pages/Checkout/Checkout.test.tsx`:

```tsx
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CART_STORAGE_KEY } from "@/features/cart/store/cartStorage";
import { renderRoute } from "@/test/renderRoute";

describe("Checkout page", () => {
  it("places an order and navigates to the success page", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: [
          { id: 1, title: "Widget", price: 10, quantity: 2, image: "/w.png" },
        ],
      })
    );

    const { router } = renderRoute("/checkout");

    await user.type(
      screen.getByPlaceholderText("Enter Address"),
      "1 Main St"
    );
    await user.type(
      screen.getByPlaceholderText("Enter Email"),
      "jane@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Enter Phone Number"),
      "0812345678"
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await user.click(
      screen.getByRole("button", { name: /place order/i })
    );

    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/order/success")
    );
    expect(
      screen.getByText("Order Placed Successfully!")
    ).toBeInTheDocument();
  });
});
```

(Selector confirmed: `BillingSummary` renders a button with the text "Place Order".)

- [ ] **Step 6: Run all tests**

Run: `npm run test`
Expected: all files PASS. Adjust selectors only to match actual rendered markup — never change page behavior to satisfy a test in this task.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: integration tests for Home, Category, Cart, and Checkout"
```

---

### Task 20: Final sweep — README, dead code, full verification

**Files:**
- Modify: `README.md` (full rewrite below)
- Modify: any files flagged by the checks below

**Interfaces:**
- Produces: a clean, fully verified branch ready for review/merge.

- [ ] **Step 1: Dead-code and consistency checks**

```bash
grep -rn "react-router-dom\|enabled: false" src/            # expect: nothing
grep -rn "axios" src/ --include="*.ts*" | grep -v shared/api # expect: nothing
grep -rn "utlls" src/                                        # expect: nothing
npx tsc -b --clean && npm run typecheck                      # expect: clean
```

Also check `package.json`: `yup`, `react-router-dom`, `eslint-plugin-import` must be gone from dependencies.

- [ ] **Step 2: Rewrite README.md**

Replace the entire contents of `README.md` with:

```markdown
# React E-commerce App

A demo storefront built on the [dummyjson](https://dummyjson.com) API:
product browsing by category, product detail with reviews, cart, and a
mock checkout flow.

## Stack

- React 19 + TypeScript, built with Vite 8
- react-router 8 (data mode)
- TanStack Query 5 for server state (query factories in `src/features/*/queries.ts`)
- react-hook-form + zod for the checkout form
- SCSS modules for styling
- Vitest + React Testing Library + MSW for tests

## Getting started

Requires Node ≥22.22.

​```bash
npm install
npm run dev        # start dev server
npm run test       # run tests once
npm run test:watch # run tests in watch mode
npm run lint       # ESLint
npm run format     # Prettier
npm run typecheck  # tsc
npm run build      # production build
​```

Configuration: `.env` sets `VITE_API_BASE_URL` (defaults to https://dummyjson.com).

## Structure

​```
src/
  app/        # providers, router, query client, layout
  pages/      # thin route components
  features/   # products, cart, checkout — each owns its api, queries, components
  shared/     # generic UI, api client, utils, hooks, types
  styles/     # global SCSS
  test/       # test setup, MSW server/handlers, render helpers
​```
```

(Remove the zero-width characters around the code fences — they're only there so this plan's own fence doesn't break.)

- [ ] **Step 3: Full verification**

Run: `npm run build && npm run lint && npm run format:check && npm run test`
Expected: all PASS.

Browser full flow: Home → category browse → product detail → add to cart → cart (reload; cart persists) → checkout (form validation, place order) → order success (cart cleared).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: update README; final modernization cleanup"
```

- [ ] **Step 5: Finish the branch**

Use the superpowers:finishing-a-development-branch skill to decide merge/PR handling for `refactor/modernization`.

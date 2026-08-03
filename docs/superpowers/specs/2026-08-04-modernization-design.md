# React E-commerce App Modernization — Design

**Date:** 2026-08-04
**Status:** Approved by user

## Goal

Bring the app to current industry standard: latest stable dependencies, idiomatic
TanStack Query usage, feature-based structure, and a test suite. The UI/UX stays
the same, with small fixes where current behavior is incomplete (cart persistence,
clear-cart-after-order, inline error states). No new features.

## Current state (problems being fixed)

- Queries declared with `enabled: false` and triggered imperatively via
  `refetch()` inside `useEffect` — defeats declarative caching.
- GET requests implemented as `useMutation` (`fetchProductsByCategory`), with
  pagination state mirrored into `useState` via `onSuccess` side effects.
- API calls defined inline inside hooks with `catch (error: any)` blocks that
  erase error typing; no shared API client, no centralized query keys.
- Dependencies ~2 years old: React 18, Vite 5, react-router-dom 6,
  TypeScript 5.6.
- Cart: Context + `useReducer`, no persistence; `CLEAR_CART` action defined but
  never implemented, so the cart survives a completed order.
- No tests, no Prettier, no path aliases; typo'd filename `price.utlls.ts`.

## Execution approach

**Phased in-place modernization** on a branch. Four phases, each leaving the app
building and working, isolating upgrade breakage from refactor breakage:

1. **Dependencies + tooling** — React 19, Vite 7, react-router 7, TS ~5.9,
   latest TanStack Query v5 + Devtools + eslint-plugin-query, Prettier,
   `@/` path alias, Vitest + React Testing Library + MSW setup. Replace yup
   with zod (`@hookform/resolvers/zod`); drop yup. Fix any React 19 peer-dep
   issues in retained libs (react-modal etc.).
2. **Data layer** — shared axios client, query-key + `queryOptions` factories,
   swap pages onto declarative queries.
3. **Feature-based restructure** — move files into `features/` + `shared/` +
   `app/` + `pages/`.
4. **Cart fixes + tests** — localStorage persistence, `CLEAR_CART` on order
   success, full test suite.

Verification per phase: `npm run build`, `npm run lint`, `npm test`, manual
smoke test in the browser.

## Target stack

Version targets confirmed against npm on 2026-08-04 (user approved deviating
from the originally drafted Vite 7 / Router 7 / TS 5.9 to current latest majors):

| Area        | Target                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| React       | 19.2.x                                                                                                                               |
| Build       | Vite 8.2 + @vitejs/plugin-react 6                                                                                                    |
| Routing     | react-router 8.3, `createBrowserRouter` + `RouterProvider` (data mode, no loaders — TanStack Query owns data). Requires Node ≥22.22. |
| Data        | TanStack Query 5.101 + Devtools + `@tanstack/eslint-plugin-query`                                                                    |
| Forms       | react-hook-form + **zod 4** (yup removed)                                                                                            |
| TypeScript  | 6.0.3, strict (TS 7 exists but typescript-eslint caps at <6.1)                                                                       |
| Lint/format | ESLint 10 flat config + Prettier; `eslint-plugin-import-x` replaces `eslint-plugin-import` (no ESLint 10 support)                    |
| Tests       | Vitest 4 + React Testing Library 16 + MSW 2 (jsdom)                                                                                  |
| HTTP        | axios (kept)                                                                                                                         |
| Styling     | SCSS modules (kept, unchanged)                                                                                                       |

**Prerequisite:** Node ≥22.22 (react-router 8 engine floor; machine currently
has 22.12 — update the Node 22 line before Phase 1).

Kept as-is: swiper, dayjs, Font Awesome, react-modal, react-paginate,
react-loading-skeleton, react-spinners, normalize.css. `.env` unchanged
(`VITE_API_BASE_URL=https://dummyjson.com`).

## Folder structure

```
src/
  app/                      # application shell
    App.tsx                 # RouterProvider + providers
    router.tsx              # createBrowserRouter route tree, route-level errorElement
    providers.tsx           # QueryClientProvider, CartProvider
    queryClient.ts          # QueryClient defaults: staleTime 60s, retry 1
    layouts/MainLayout/     # Header + Outlet + Footer
  pages/                    # thin route components composing features
    Home/  Category/  Product/  Cart/  Checkout/  OrderSuccess/
  features/
    products/
      api.ts                # getProducts, getProductsByCategory, getCategories, getProduct
      queries.ts            # query-key factory + queryOptions factories
      types.ts              # Product, Category, FetchProductsResponse
      components/           # ProductCard, ProductsList, CategoryMenu, ProductDetailInfo,
                            #   ProductImageGallery, ReviewSection, ReviewCard, RatingBreakdown
    cart/
      store/                # CartContext, CartProvider, cartReducer, localStorage persistence
      useCart.ts
      components/           # CartTable, CartSummary, AddToCartModalContent
    checkout/
      api.ts                # placeOrder
      useCheckout.ts
      schema.ts             # zod schema for the address form
      consts.ts             # delivery/payment options
      components/           # CheckoutAddressBox/Form, CheckoutDeliveryBox, CheckoutPaymentBox,
                            #   BillingSummary, DeliveryOption, PaymentOption,
                            #   SummaryOrder, SummaryOrderItem
  shared/
    api/client.ts           # axios instance, baseURL from env, error-normalizing interceptor
    components/             # Button, Input, RadioInput, Modal, Pagination, ImageZoom,
                            #   SwiperCarousel, CountdownTimer, FeatureCard, StarReview,
                            #   Header, Footer
    utils/                  # price.utils.ts (typo fixed), pagination.utils.ts
    types/                  # Pagination, global.d.ts
  styles/                   # SCSS partials, unchanged
  test/                     # Vitest setup, MSW server + handlers
```

Each `.module.scss` moves with its component. `configs/environment.ts` folds
into `shared/api/client.ts`.

## Data layer

- **`shared/api/client.ts`** — one axios instance. A response interceptor
  normalizes failures into a typed `ApiError` (message from
  `error.response.data.message`, fallback to a generic message). Per-call
  try/catch wrappers are removed.
- **`features/products/api.ts`** — pure typed request functions; no error
  re-wrapping.
- **`features/products/queries.ts`** — query-key factory plus `queryOptions()`
  factories:
  - `productQueries.list({ page, limit })` — best products / deals
  - `productQueries.byCategory({ category, page, limit })` — with
    `placeholderData: keepPreviousData` so pagination doesn't flash empty
  - `productQueries.categories()` — long `staleTime` (categories rarely change)
  - `productQueries.detail(id)`
- Pages call `useQuery(productQueries.xxx(...))` declaratively. Pagination
  totals derive from the query response, not mirrored state. "Select first
  category when loaded" becomes derived state:
  `currentCategory = selected ?? categories?.[0]` — no effect.
- `useCheckout.placeOrder` stays a `useMutation`; on success it clears the cart
  and navigates to order success.
- Query Devtools mounted in dev only.

## Error handling

- Pages render an inline error state when a query fails (currently a failed
  query leaves an eternal empty/loading state).
- Route-level `errorElement` in the router catches render errors.
- No toast system — beyond the "small fixes" scope.

## Cart

- Persist cart to `localStorage`: lazy `useReducer` initializer + write-through
  on state change.
- Implement `CLEAR_CART`; dispatch after successful order placement.
- All other behavior identical.

## Testing

Vitest + jsdom + RTL + MSW with dummyjson-shaped handlers in `src/test/`.

- **Unit:** `cartReducer` (add/remove/update/clear, persistence), price utils,
  pagination utils, checkout zod schema.
- **Hooks:** product queries via `renderHook` + MSW; `useCheckout` mutation flow
  (success clears cart + navigates; missing address errors).
- **Component/integration:** Home renders products from MSW, Category
  pagination, Cart quantity updates, Checkout happy path.
- **Scripts:** `test`, `test:watch`, `typecheck`.

## Out of scope

- New features, visual redesign, URL-driven category/page state, toast
  notifications, replacing UI libraries (react-modal, swiper, etc.), CI setup.

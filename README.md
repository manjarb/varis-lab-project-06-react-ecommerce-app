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

```bash
npm install
npm run dev        # start dev server
npm run test       # run tests once
npm run test:watch # run tests in watch mode
npm run lint       # ESLint
npm run format     # Prettier
npm run typecheck  # tsc
npm run build      # production build
```

Configuration: `.env` sets `VITE_API_BASE_URL` (defaults to https://dummyjson.com).

## Structure

```
src/
  app/        # providers, router, query client, layout
  pages/      # thin route components
  features/   # products, cart, checkout — each owns its api, queries, components
  shared/     # generic UI, api client, utils, hooks, types
  styles/     # global SCSS
  test/       # test setup, MSW server/handlers, render helpers
```

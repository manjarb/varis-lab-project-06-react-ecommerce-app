/// <reference types="vitest/globals" />
// Triple-slash directive here (not tsconfig types) because tsconfig.app.json's custom
// typeRoots breaks "types": ["vitest/globals"] resolution (TS2688); ambient globals
// propagate program-wide from this file.
import "@testing-library/jest-dom/vitest";
import { server } from "./msw/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

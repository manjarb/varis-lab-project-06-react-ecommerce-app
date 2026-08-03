import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite 8 (Rolldown) tightened CJS default-import interop: since this project's
  // package.json has "type": "module", default imports of CJS deps that use the
  // TS/Babel esModuleInterop convention (module.exports.default, e.g.
  // react-spinners, react-paginate) now resolve to the whole module object
  // instead of unwrapping `.default`, breaking those components at runtime
  // ("Element type is invalid"). This restores the pre-Vite-8 unwrapping
  // behavior. See https://vite.dev/guide/migration (CJS interop changes).
  legacy: {
    inconsistentCjsInterop: true,
  },
})

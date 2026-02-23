import { fileURLToPath } from "node:url"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const playgroundDir = fileURLToPath(new URL(".", import.meta.url))
const srcEntry = fileURLToPath(new URL("../src/index.ts", import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@team-good-io/react-form-builder": srcEntry
    }
  },
  root: playgroundDir
})

import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import wasm from "vite-plugin-wasm"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wasm(), vue()],
  // optimizeDeps: {
  //   include: ["ag-wasm > web-tree-sitter-sg"],
  //   exclude: ["ag-wasm"],
  // },
})

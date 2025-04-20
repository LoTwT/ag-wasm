import { defineConfig } from "bumpp"

export default defineConfig({
  files: ["package.json", "Cargo.toml", "Cargo.lock"],
  recursive: true,
})

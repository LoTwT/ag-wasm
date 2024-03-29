import { copy, ensureDir } from "fs-extra"

const filesMap = [
  // wasm
  ["pkg/node/index_bg.wasm", "dist/index_bg.wasm"],
  ["pkg/node/index_bg.wasm.d.ts", "dist/index_bg.wasm.d.ts"],

  // node
  ["pkg/node/index.js", "dist/index.node.js"],
  ["pkg/node/index.d.ts", "dist/index.node.d.ts"],

  // bundler
  ["pkg/bundler/index.js", "dist/index.bundler.js"],
  ["pkg/bundler/index.d.ts", "dist/index.bundler.d.ts"],
  ["pkg/bundler/index_bg.js", "dist/index_bg.js"],

  // web
  ["pkg/web/index.js", "dist/index.web.js"],
  ["pkg/web/index.d.ts", "dist/index.web.d.ts"],
]

async function build() {
  console.log("\n🚀 Start Building...\n")

  ensureDir("dist")

  await Promise.all(filesMap.map(([from, to]) => copy(from, to)))

  console.log("\n📦 Finish Building...\n")
}

await build()

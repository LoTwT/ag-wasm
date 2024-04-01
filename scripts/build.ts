import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { copy, ensureDir } from "fs-extra"
import { type PackageJson, readPackageJSON, writePackageJSON } from "pkg-types"

const _dirname = fileURLToPath(new URL(".", import.meta.url))

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

  // shared
  ["LICENSE", "LICENSE"],
  ["README.md", "README.md"],
]

async function build() {
  console.log("\n🚀 Start Building...\n")

  ensureDir("dist")
  ensureDir("dist/dist")

  await Promise.all(
    filesMap.map(([from, to]) =>
      copy(resolve(_dirname, "..", from), resolve(_dirname, "../dist", to)),
    ),
  )

  const localPkgJson = await readPackageJSON()
  const wasmPkgjSON = await readPackageJSON(resolve(_dirname, "../pkg/node"))

  const publishPkgJson: PackageJson = {
    name: localPkgJson.name,
    description: localPkgJson.description,
    type: "module",
    author: localPkgJson.author,
    license: localPkgJson.license,
    homepage: localPkgJson.homepage,
    repository: localPkgJson.repository,
    bugs: localPkgJson.bugs,
    keywords: localPkgJson.keywords,
    files: ["dist"],
    exports: {
      ".": {
        require: "./dist/index.web.js",
        import: "./dist/index.web.js",
      },
      "./node": {
        require: "./dist/index.node.js",
        import: "./dist/index.node.js",
      },
      "./bundler": {
        require: "./dist/index.bundler.js",
        import: "./dist/index.bundler.js",
      },
      // @ts-ignore
      "./*": ["./*", "./*.d.ts"],
    },
    main: "./dist/index.web.js",
    module: "./dist/index.web.js",
    types: "./dist/index.web.d.ts",
    typesVersions: {
      "*": {
        "*": ["./dist/*", "./*"],
      },
    },
    dependencies: wasmPkgjSON.dependencies,
    scripts: {
      release: "npm publish",
    },
  }

  await writePackageJSON(
    resolve(_dirname, "../dist/package.json"),
    publishPkgJson,
  )

  console.log("\n📦 Finish Building...\n")
}

await build()

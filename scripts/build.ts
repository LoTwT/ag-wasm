import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { copy, ensureDir } from "fs-extra"
import { type PackageJson, readPackageJSON, writePackageJSON } from "pkg-types"
import fg from "fast-glob"

const _dirname = fileURLToPath(new URL(".", import.meta.url))

const sharedFiles = [
  ["LICENSE", "LICENSE"],
  ["README.md", "README.md"],
]

async function build() {
  console.log("\n🚀 Start Building...\n")

  ensureDir("dist")
  ensureDir("dist/dist")

  const pkgFiles = (
    await fg("pkg/**/*", {
      cwd: resolve(_dirname, ".."),
      ignore: [
        "**/package.json",
        "**/README.md",
        "**/LICENSE",
        "**/.gitignore",
      ],
    })
  )
    .map((file) => [file, file.replace("pkg/", "dist/")])
    .map(([_, to]) => [
      _,
      to.startsWith("dist/node") && to.endsWith(".js")
        ? to.replace(/\.js$/, ".cjs")
        : to,
    ])

  const files = [...sharedFiles, ...pkgFiles]

  await Promise.all(
    files.map(([from, to]) =>
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
    sideEffects: ["**/*.wasm"],
    exports: {
      ".": {
        require: "./dist/web/index.js",
        import: "./dist/web/index.js",
      },
      "./node": {
        require: "./dist/node/index.cjs",
        import: "./dist/node/index.cjs",
      },
      "./bundler": {
        require: "./dist/bundler/index.js",
        import: "./dist/bundler/index.js",
      },
      "./wasm": "./dist/web/index_bg.wasm",
      "./node/wasm": "./dist/node/index_bg.wasm",
      "./bundler/wasm": "./dist/bundler/index_bg.wasm",
      // @ts-ignore
      "./*": ["./*", "./*.d.ts"],
    },
    main: "./dist/web/index.js",
    module: "./dist/web/index.js",
    types: "./dist/web/index.d.ts",
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

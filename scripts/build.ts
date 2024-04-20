import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { rimraf } from "rimraf"
import { copy, ensureDir } from "fs-extra"
import fg from "fast-glob"

const _dirname = fileURLToPath(new URL(".", import.meta.url))

async function build() {
  console.log("\n🚀 Start Building...\n")

  const pkgPath = resolve(_dirname, "../packages/ag-wasm")
  const distPath = resolve(pkgPath, "dist")

  await rimraf(distPath)
  await ensureDir(distPath)

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
    .map((file) => [file, file.replace("pkg/", "")])
    .map(([_, to]) => [
      _,
      to === "node/index.js" || to === "node/index.d.ts"
        ? `${to.slice(0, -2)}c${to.slice(-2)}`
        : to,
    ])

  await Promise.all(
    pkgFiles.map(([from, to]) =>
      copy(resolve(_dirname, "..", from), resolve(distPath, to)),
    ),
  )

  console.log("\n📦 Finish Building...\n")
}

await build()

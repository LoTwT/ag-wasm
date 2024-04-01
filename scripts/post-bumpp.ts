import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { readPackageJSON, writePackageJSON } from "pkg-types"

const _dirname = fileURLToPath(new URL(".", import.meta.url))

async function run() {
  const publishPkgJsonPath = resolve(_dirname, "../dist/package.json")

  const localPkgJson = await readPackageJSON()
  const publishPkgJson = await readPackageJSON(publishPkgJsonPath)

  publishPkgJson.version = localPkgJson.version

  await writePackageJSON(publishPkgJsonPath, publishPkgJson)
}

await run()

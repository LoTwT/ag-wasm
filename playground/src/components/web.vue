<script setup lang="ts">
import init, { initializeTreeSitter, setupParser, dumpASTNodes } from "ag-wasm"
import { ref, watch } from "vue"

await init()
await initializeTreeSitter({
  locateFile: () => `tree-sitter.wasm`,
  // `https://cdn.jsdelivr.net/npm/web-tree-sitter@0.25.3/tree-sitter.wasm`,
})
await setupParser("typescript", "tree-sitter-typescript.wasm")

const code = ref(`export const web = "ag-wasm/web"`)
const data = ref()

watch(
  () => code.value,
  () => {
    data.value = JSON.stringify(dumpASTNodes(code.value), null, 2)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <textarea v-model="code"></textarea>
  <div>data: {{ data }}</div>
</template>

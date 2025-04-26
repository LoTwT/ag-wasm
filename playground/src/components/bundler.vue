<script setup lang="ts">
import {
  initializeTreeSitter,
  setupParser,
  dumpASTNodes,
} from "ag-wasm/bundler"
import { ref, watch } from "vue"

await initializeTreeSitter({
  locateFile: () => `tree-sitter.wasm`,
  // `https://cdn.jsdelivr.net/npm/web-tree-sitter@0.25.3/tree-sitter.wasm`,
})
await setupParser("typescript", "tree-sitter-typescript.wasm")

const code = ref(`export const bundler = "ag-wasm/bundler"`)
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
  <div>output: {{ data }}</div>
</template>

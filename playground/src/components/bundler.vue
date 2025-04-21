<script setup lang="ts">
import {
  initializeTreeSitter,
  setupParser,
  dumpASTNodes,
} from "ag-wasm/bundler"
import { ref, watch } from "vue"

await initializeTreeSitter()
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

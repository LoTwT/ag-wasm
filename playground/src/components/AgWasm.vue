<script setup lang="ts">
import init, { initializeTreeSitter, setupParser, dumpASTNodes } from "ag-wasm"
import { ref, watch } from "vue"

await init()
await initializeTreeSitter()
await setupParser("typescript", "tree-sitter-typescript.wasm")

const code = ref("cosnt one = 1")
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

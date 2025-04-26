<script setup lang="ts">
import AgWasm from "./components/web.vue"
// import AgBundler from "./components/bundler.vue"
</script>

<template>
  <h2>ag-wasm web</h2>
  <Suspense>
    <AgWasm />
    <template #fallback>ag-wasm web loading...</template>
  </Suspense>

  <!-- <h2>ag-wasm bundler</h2>
  <Suspense>
    <AgBundler />
    <template #fallback>ag-wasm bundler loading...</template>
  </Suspense> -->
</template>

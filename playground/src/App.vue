<script setup lang="ts">
import AgWasm from "./components/AgWasm.vue"
</script>

<template>
  <Suspense>
    <AgWasm />

    <template #fallback>loading...</template>
  </Suspense>
</template>

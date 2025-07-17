<script setup lang="ts">
  import TopBar from './components/TopBar.vue'
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <div class="sticky top-0 z-10">
      <TopBar />
    </div>

    <div class="flex-1 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<style scoped></style>

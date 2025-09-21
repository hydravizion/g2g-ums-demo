<script setup lang="ts">
  import TopBar from './components/TopBar.vue'
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden items-center">
    <div class="sticky top-0 z-10 w-full">
      <TopBar />
    </div>

    <div class="flex-1 overflow-y-auto w-full md:w-1/2">
      <router-view />
    </div>
  </div>
</template>

<style scoped></style>

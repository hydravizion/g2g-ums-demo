<script setup lang="ts">
  import TopBar from './components/TopBar.vue'
</script>

<template>
  <div class="app-container">
    <TopBar />
    <router-view />
  </div>
</template>

<style scoped>
  .app-container {
    @apply flex flex-col w-screen h-screen overflow-auto;
    background-color: #4a739c06;
  }
</style>

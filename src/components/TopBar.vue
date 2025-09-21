<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

  const route = useRoute()
  const router = useRouter()

  const goBack = () => {
    router.back()
  }
</script>

<template>
  <div class="flex flex-row py-1 min-h-16 h-fit lg:h-16 border-b border-gray-200 shrink-0">
    <div class="flex items-center px-4 w-full">
      <ArrowLeftIcon v-if="route.name !== 'Home'" @click="goBack" class="w-6 h-6 text-gray-600" />

      <p v-if="route.name === 'Home'" class="font-bold text-lg">7shi Recipes</p>

      <p v-else-if="route.name === 'CategoryDetails'" class="font-bold text-lg mx-auto">
        {{ route.params.categoryName }}
      </p>

      <p v-else-if="route.name === 'Recipe'" class="font-bold text-lg"></p>

      <ArrowLeftIcon v-if="route.name !== 'Home'" class="w-6 h-6 text-transparent" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getAllCategories } from '../services/firebase'
  import { Category } from '../interfaces/recipes'
  import { useRouter } from 'vue-router'
  import { fallbackUrlCreator } from '../utils'

  const categories = ref<Category[]>([])
  const router = useRouter()

  onMounted(async () => {
    categories.value = await getAllCategories()
  })

  const goToCategory = (id: string, name: string) => {
    router.push({ name: 'CategoryDetails', params: { id, categoryName: name } })
  }
</script>

<template>
  <div class="flex flex-col p-6 gap-y-6">
    <h2 class="text-black text-2xl font-bold">Categories</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="c in categories"
        :key="c.id"
        class="relative bg-white rounded-xl shadow overflow-hidden cursor-pointer transition hover:opacity-80"
        @click="goToCategory(c.id, c.name)"
      >
        <img
          :src="c.image"
          class="w-full h-full object-cover"
          @error="fallbackUrlCreator($event, c.name)"
        />
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="absolute bottom-4 left-4 flex items-center justify-center">
          <h2 class="text-white text-2xl font-bold">{{ c.name }}</h2>
        </div>
      </div>
    </div>
  </div>

  <div v-if="categories.length === 0" class="text-center">Nothing here</div>
</template>

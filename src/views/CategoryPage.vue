<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getRecipesByCategory } from '../services/firebase'
  import { Recipe } from '../interfaces/recipes'
  import { useRouter } from 'vue-router'

  const recipes = ref<Recipe[]>([])
  const router = useRouter()

  const props = defineProps<{
    id: string
    categoryName: string
  }>()

  onMounted(async () => {
    recipes.value = await getRecipesByCategory(props.id)
  })

  const goToRecipe = (id: string) => {
    router.push({ name: 'RecipeDetails', params: { id } })
  }
</script>

<template>
  <div class="flex flex-col gap-y-2 w-full p-2">
    <div class="relative">
      <input
        class="w-full rounded-full border-transparent bg-primary/20 py-3 pl-12 pr-4 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary hover:bg-primary/30 transition"
        placeholder="Search recipes"
        type="search"
        :disabled="recipes.length === 0"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          class="h-5 w-5 text-black/60"
          fill="none"
          height="20"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
        </svg>
      </div>
    </div>

    <div
      v-for="recipe in recipes"
      class="flex flex-row w-full h-48 gap-x-2 p-4 rounded-xl shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-200 transition"
      @click="goToRecipe(recipe.id)"
    >
      <div class="flex flex-col justify-between w-2/3">
        <div class="flex flex-col gap-y-2">
          <p class="text-xs font-semibold uppercase tracking-wider text-primary">
            {{ recipe.highlightInfo }}
          </p>
          <h2 class="text-base font-bold text-black">{{ recipe.title }}</h2>
        </div>
        <p class="text-sm text-black/60">{{ recipe.description }}</p>
      </div>
      <div class="h-full w-1/3 rounded-2xl overflow-hidden">
        <img :src="recipe.images[0]" class="w-full h-full object-cover object-center" />
      </div>
    </div>
  </div>
  <div v-if="recipes.length === 0" class="text-center my-10">{{ `Nothing to show here :(` }}</div>
</template>

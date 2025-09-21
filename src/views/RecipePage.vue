<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getRecipeById } from '../services/firebase'
  import { Recipe } from '../interfaces/recipes'
  import { formatDuration, intervalToDuration } from 'date-fns'

  const recipe = ref<Recipe | null>({
    id: '',
    title: '',
    servings: 0,
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    totalTimeMinutes: 0,
    images: [''],
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const props = defineProps<{
    id: string
  }>()

  const formatMinutes = (mins: number) => {
    const dur = intervalToDuration({ start: 0, end: mins * 60 * 1000 })
    return formatDuration(dur, { format: ['hours', 'minutes'] })
  }

  onMounted(async () => {
    recipe.value = await getRecipeById(props.id)
  })
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="h-80 w-full overflow-hidden">
      <img alt="Creamy Tomato Pasta" class="h-full w-full object-cover" :src="recipe?.images[0]" />
    </div>
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900">{{ recipe.title || 'Title' }}</h1>
      <p class="mt-2 text-sm text-gray-500">
        {{
          `Prep time: ${recipe.prepTimeMinutes} min | Cook time: ${recipe.cookTimeMinutes} min | Total time: ${recipe.totalTimeMinutes} min`
        }}
      </p>
      <div class="mt-8">
        <h2 class="text-xl font-bold text-gray-900">Ingredients</h2>
        <div class="mt-4 space-y-6">
          <div v-for="(ingredient, i) in recipe.ingredients" :key="i">
            <h3 class="text-lg font-semibold text-gray-800">{{ ingredient.section }}</h3>
            <div class="mt-3 space-y-4">
              <label v-for="item in ingredient.items" class="flex items-center space-x-3">
                <span class="text-base text-gray-800">{{
                  `${item.amount} ${item.unit}  ${item.name}`
                }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <h2 class="text-xl font-bold text-gray-900">Instructions</h2>
        <div class="mt-4 space-y-6">
          <div v-for="(step, i) in recipe.steps" :key="i">
            <h3 class="text-lg font-semibold text-gray-800">{{ step.section }}</h3>
            <div class="mt-3 space-y-4">
              <label v-for="item in step.instructions" class="flex items-center space-x-3">
                <span class="text-base text-gray-800">{{ `${item.order}. ${item.text} ` }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

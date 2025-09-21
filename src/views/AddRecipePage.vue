<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { createRecipe, getAllCategories } from '../services/firebase'
  import { useRouter } from 'vue-router'
  import type { Category, IngredientSection, StepSection } from '../interfaces/recipes'

  const router = useRouter()

  // Form state
  const name = ref('')
  const categoryId = ref('')
  const description = ref('')
  const servings = ref(1)
  const prepTime = ref(0)
  const cookTime = ref(0)
  const totalTime = ref(0)
  const image = ref('')
  const highlightInfo = ref('')
  const references = ref('')

  // Dynamic fields
  const ingredients = ref<IngredientSection[]>([])
  const steps = ref<StepSection[]>([])

  // Categories
  const categories = ref<Category[]>([])

  // Loading state
  const isSubmitting = ref(false)

  onMounted(async () => {
    categories.value = await getAllCategories()
  })

  const handleSubmit = async () => {
    // if (!name.value || !categoryId.value) return

    isSubmitting.value = true

    const payload = {
      title: name.value,
      categoryId: categoryId.value,
      description: description.value,
      servings: servings.value,
      prepTimeMinutes: prepTime.value,
      cookTimeMinutes: cookTime.value,
      totalTimeMinutes: totalTime.value,
      ingredients: ingredients.value,
      steps: steps.value,
      images: image.value ? [image.value] : [],
      highlightInfo: highlightInfo.value,
      references: references.value,
    }
    console.log(payload)

    try {
      await createRecipe(payload)
      router.push({ name: 'Home' })
    } catch (err) {
      console.error(err)
    } finally {
      isSubmitting.value = false
    }
  }

  // 👉 Ingredient functions
  const addIngredientSection = () => {
    ingredients.value.push({ section: `Section ${ingredients.value.length + 1}`, items: [] })
  }

  const removeIngredientSection = (sectionIndex: number) => {
    ingredients.value.splice(sectionIndex, 1)
  }

  const addIngredientItem = (sectionIndex: number) => {
    ingredients.value[sectionIndex].items.push({ name: '', amount: '', unit: '' })
  }

  const removeIngredientItem = (sectionIndex: number, itemIndex: number) => {
    ingredients.value[sectionIndex].items.splice(itemIndex, 1)
  }

  // 👉 Step functions
  const addStepSection = () => {
    steps.value.push({ section: `Section ${steps.value.length + 1}`, instructions: [] })
  }

  const removeStepSection = (sectionIndex: number) => {
    steps.value.splice(sectionIndex, 1)
  }

  const addStepItem = (sectionIndex: number) => {
    steps.value[sectionIndex].instructions.push({
      order: steps.value[sectionIndex].instructions.length + 1,
      text: '',
    })
  }

  const removeStepItem = (sectionIndex: number, stepIndex: number) => {
    steps.value[sectionIndex].instructions.splice(stepIndex, 1)
  }
</script>
<template>
  <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
    <!-- Basic info -->
    <div>
      <label class="block font-medium">Recipe Name</label>
      <input v-model="name" />
    </div>

    <div>
      <label class="block font-medium">Category</label>
      <select
        v-model="categoryId"
        class="w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary h-14 px-4"
      >
        <option disabled value="">Select a category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="block font-medium">Description</label>
      <textarea
        v-model="description"
        class="w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary min-h-[120px] p-4"
      />
    </div>

    <div class="space-y-2">
      <label class="text-base font-medium text-gray-700" for="image-url">Image Base64</label>
      <input id="image-url" placeholder="base64" type="text" v-model="image" />
    </div>

    <div
      v-show="image"
      class="w-full aspect-[16/9] bg-white rounded-lg bg-cover bg-center bg-no-repeat"
    >
      <img :src="image" />
    </div>

    <!-- Ingredients -->
    <div>
      <h2 class="font-semibold text-lg mb-2">Ingredients</h2>
      <div v-for="(section, sIdx) in ingredients" :key="sIdx" class="border p-3 rounded mb-3">
        <div class="flex justify-between items-center mb-2 gap-x-2">
          <input v-model="section.section" />
          <button
            type="button"
            @click="removeIngredientSection(sIdx)"
            class="flex-1 py-1 px-2 rounded-lg bg-red-500 text-white font-bold text-base"
          >
            Remove Section
          </button>
        </div>

        <div v-for="(item, iIdx) in section.items" :key="iIdx" class="flex space-x-2 mb-2">
          <input v-model="item.name" placeholder="Name" />
          <input v-model="item.amount" placeholder="Amount" />
          <input v-model="item.unit" placeholder="Unit" />
          <button
            type="button"
            @click="removeIngredientItem(sIdx, iIdx)"
            class="flex-1 py-1 px-2 rounded-lg text-red-500 font-bold text-base"
          >
            X
          </button>
        </div>

        <button
          type="button"
          @click="addIngredientItem(sIdx)"
          class="flex-1 py-3 px-5 rounded-lg bg-primary text-white font-bold text-base"
        >
          + Add Ingredient
        </button>
      </div>
      <button
        type="button"
        @click="addIngredientSection"
        class="flex-1 py-3 px-5 rounded-lg bg-green-500 text-white font-bold text-base"
      >
        + Add Section
      </button>
    </div>

    <!-- Steps -->
    <div>
      <h2 class="font-semibold text-lg mb-2">Instructions</h2>
      <div v-for="(section, sIdx) in steps" :key="sIdx" class="border p-3 rounded mb-3">
        <div class="flex justify-between items-center mb-2 gap-x-2">
          <input v-model="section.section" />
          <button
            type="button"
            @click="removeStepSection(sIdx)"
            class="flex-1 py-1 px-2 rounded-lg bg-red-500 text-white font-bold text-base"
          >
            Remove Section
          </button>
        </div>

        <div
          v-for="(step, stIdx) in section.instructions"
          :key="stIdx"
          class="flex items-center space-x-2 mb-2"
        >
          <span class="font-medium w-6">{{ stIdx + 1 }}.</span>
          <input v-model="step.text" placeholder="Instruction" />
          <button
            type="button"
            @click="removeStepItem(sIdx, stIdx)"
            class="flex-1 py-1 px-2 rounded-lg text-red-500 font-bold text-base"
          >
            X
          </button>
        </div>

        <button
          type="button"
          @click="addStepItem(sIdx)"
          class="flex-1 py-3 px-5 rounded-lg bg-primary text-white font-bold text-base"
        >
          + Add Step
        </button>
      </div>
      <button
        type="button"
        @click="addStepSection"
        class="flex-1 py-3 px-5 rounded-lg bg-green-500 text-white font-bold text-base"
      >
        + Add Section
      </button>
    </div>
    <div>
      <label class="block font-medium">Servings</label>
      <input v-model="servings" />
    </div>
    <div>
      <label class="block font-medium">Preparation Time</label>
      <input v-model="prepTime" />
    </div>
    <div>
      <label class="block font-medium">Cook Time</label>
      <input v-model="cookTime" />
    </div>
    <div>
      <label class="block font-medium">Total Time</label>
      <input v-model="totalTime" />
    </div>
    <div>
      <label class="block font-medium">Highlights</label>
      <input v-model="highlightInfo" />
    </div>
    <div>
      <label class="block font-medium">References</label>
      <input v-model="references" />
    </div>

    <!-- Submit -->
    <div>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="flex-1 py-3 px-5 rounded-lg bg-primary text-white font-bold text-base"
      >
        {{ isSubmitting ? 'Saving...' : 'Save Recipe' }}
      </button>
    </div>
  </form>
</template>

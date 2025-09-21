<script setup lang="ts">
  import { ref } from 'vue'
  import { createCategory } from '../services/firebase'
  import { useRouter } from 'vue-router'
  import { ArrowPathIcon } from '@heroicons/vue/24/outline'
  const router = useRouter()

  const name = ref('')
  const slug = ref('')
  const description = ref('')
  const image = ref('')

  const isSubmitting = ref(false)

  const handleSubmit = async () => {
    if (!name.value || !slug.value) return

    isSubmitting.value = true

    try {
      await createCategory({
        name: name.value,
        slug: slug.value,
        description: description.value,
        image: image.value,
      })
      router.push({ name: 'Home' })
    } catch (err) {
      console.error(err)
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-8 h-full flex flex-col">
    <!-- Title (fixed at top) -->
    <h1 class="text-2xl font-bold mb-6 shrink-0">Add Category</h1>

    <!-- Scrollable Form -->
    <div class="flex-grow flex flex-col space-y-6 py-6 overflow-y-auto pr-2">
      <div class="space-y-2">
        <label class="text-base font-medium text-gray-700" for="name">Name</label>
        <input id="name" placeholder="e.g. Vegan" type="text" v-model="name" />
      </div>

      <div class="space-y-2">
        <label class="text-base font-medium text-gray-700" for="slug">Slug</label>
        <input id="slug" placeholder="e.g. vegan" type="text" v-model="slug" />
      </div>

      <div class="space-y-2">
        <label class="text-base font-medium text-gray-700" for="description">Description</label>
        <textarea
          class="w-full rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary min-h-[120px] p-4"
          id="description"
          placeholder="A short description of the category..."
          v-model="description"
        ></textarea>
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
    </div>

    <!-- Footer (fixed at bottom) -->
    <div class="sticky bottom-0 bg-white p-4 shrink-0">
      <div class="flex items-center justify-center space-x-4">
        <!-- <button class="flex-1 py-3 px-5 rounded-lg bg-gray-200 text-gray-800 font-bold text-base">
          Cancel
        </button> -->
        <button
          class="flex-1 py-3 px-5 rounded-lg bg-primary text-white font-bold text-base"
          @click="handleSubmit"
          :disabled="isSubmitting"
        >
          <ArrowPathIcon v-if="isSubmitting" class="w-5 h-5 mx-auto text-white animate-spin" />
          <p v-else>Save</p>
        </button>
      </div>
    </div>
  </div>
</template>

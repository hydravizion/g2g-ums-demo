<script setup lang="ts">
  import router from '../router/router'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const navigateTo = (route: string) => {
    router.push(route)
  }

  const isOnPage = (pathName: string) => {
    return route.name === pathName
  }
</script>
<template>
  <div class="flex flex-row py-1 min-h-16 h-fit lg:h-16 border-b border-gray-200 shrink-0">
    <div class="flex justify-start items-center px-10 w-1/2">
      <p class="font-bold text-lg">User Management System</p>
    </div>
    <div class="flex flex-row justify-end gap-x-10 px-10 w-1/2">
      <div
        class="flex justify-center items-center h-full font-medium text-sm cursor-pointer hover:underline"
        :class="{ underline: isOnPage('DashBoard') }"
        @click="navigateTo('/dashboard')"
      >
        Dashboard
      </div>
      <div
        class="flex justify-center items-center h-full font-medium text-sm cursor-pointer hover:underline"
        :class="{ underline: isOnPage('AddUser') }"
        @click="navigateTo('/add-user')"
      >
        Create
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import DataTable from '../components/DataTable.vue'

  const currentViewType = ref<'list' | 'grid'>('list')

  function changeViewType(type: 'list' | 'grid') {
    currentViewType.value = type
  }
</script>
<template>
  <div class="flex flex-col justify-center py-10 px-40 gap-y-5">
    <p class="font-bold text-2xl">User List</p>
    <div class="flex flex-row w-full h-10 rounded-lg p-1 justify-center items-center bg-gray-300">
      <div
        class="view-selector rounded-lg bg-transparent hover:bg-gray-100"
        :class="{ 'bg-white': currentViewType === 'list' }"
        @click="changeViewType('list')"
      >
        List
      </div>
      <div
        class="view-selector rounded-lg bg-transparent hover:bg-gray-100"
        :class="{ 'bg-white': currentViewType === 'grid' }"
        @click="changeViewType('grid')"
      >
        Grid
      </div>
    </div>
    <DataTable
      :columns="[
        { label: 'Profile Picture', key: 'profilePicture' },
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Date of Birth', key: 'dob' },
        { label: 'Gender', key: 'gender' },
        { label: 'Created At', key: 'createdAt' },
        { label: 'Updated At', key: 'updatedAt' },
      ]"
      :data="[
        {
          name: 'Ethan Harper',
          email: 'ethan.harper@example.com',
          dob: '1990-05-15',
          gender: 'Male',
          profilePicture: 'https://i.pravatar.cc/100?img=1',
          createdAt: '2 minutes ago',
          updatedAt: '2 minutes ago',
        },
        {
          name: 'Olivia Bennett',
          email: 'olivia.bennett@example.com',
          dob: '1988-12-20',
          gender: 'Female',
          profilePicture: 'https://i.pravatar.cc/100?img=2',
          createdAt: '5 minutes ago',
          updatedAt: '5 minutes ago',
        },
      ]"
      :rows-per-page="3"
      :view-type="currentViewType"
      :filterable-columns="[
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
      ]"
    >
      <!-- Slot for profile picture column -->
      <template #cell-profilePicture="{ value }">
        <img :src="value" class="h-10 w-10 rounded-full object-cover" />
      </template>
    </DataTable>
  </div>
</template>
<style lang="postcss">
  .view-selector {
    @apply flex flex-row justify-center items-center h-full w-1/2 cursor-pointer transition duration-300;
  }
</style>

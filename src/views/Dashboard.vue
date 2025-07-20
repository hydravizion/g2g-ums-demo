<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import DataTable from '../components/DataTable.vue'
  import { User } from '../interfaces/user'
  import { getAllUsers } from '../services/firebase'

  const userList = ref<User[]>([])
  const currentViewType = ref<'list' | 'grid'>('list')

  function changeViewType(type: 'list' | 'grid') {
    currentViewType.value = type
  }

  onMounted(async () => {
    try {
      const userRes = await getAllUsers()
      userList.value = userRes
    } catch (error) {
      alert(error)
    }
  })
</script>
<template>
  <div class="flex flex-col justify-center py-10 px-5 lg:px-40 gap-y-5">
    <p class="font-bold text-2xl">User List</p>
    <div
      class="flex flex-row w-full h-10 rounded-lg p-1 gap-x-2 justify-center items-center bg-gray-300"
    >
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
      :data="userList"
      :rows-per-page="4"
      :view-type="currentViewType"
      :filterable-columns="[
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
      ]"
    >
    </DataTable>
  </div>
</template>
<style lang="postcss">
  .view-selector {
    @apply flex flex-row justify-center items-center h-full w-1/2 cursor-pointer transition duration-300;
  }
</style>

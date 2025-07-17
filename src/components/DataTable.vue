<template>
  <div class="space-y-4">
    <!-- Search & Filter -->
    <div class="flex justify-end items-center space-x-2">
      <div
        class="border border-gray-400 px-5 py-2 rounded-full text-sm cursor-pointer mr-auto hover:bg-green-200 hover:border-green-500 transition"
      >
        Export To CSV
      </div>
      <select
        v-model="selectedSortKey"
        class="border border-gray-400 px-3 py-2 rounded-full text-sm mx-auto"
      >
        <option v-for="col in sortTypes" :key="col.key + col.order" :value="col">
          {{ col.label }}
        </option>
      </select>
      <label class="text-sm">Search by:</label>
      <select
        v-model="selectedFilterKey"
        class="border border-gray-400 px-3 py-2 rounded-full text-sm"
      >
        <option v-for="col in filterTypes" :key="col.key" :value="col">
          {{ col.label }}
        </option>
      </select>

      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search..."
        class="border border-gray-400 px-3 py-2 rounded-full text-sm"
      />
    </div>

    <!-- List View -->
    <div v-if="viewType === 'list'" class="flex flex-col gap-y-6 overflow-x-auto rounded-md">
      <div
        v-for="(row, index) in paginatedData"
        :key="index"
        class="flex flex-row h-full justify-between items-center rounded-2xl border border-gray-200 shadow text-center gap-x-4 hover:bg-gray-100 transition"
      >
        <div class="flex flex-col text-start px-10">
          <div class="font-semibold text-lg">{{ row.name }}</div>
          <div class="text-sm text-gray-500">{{ row.email }}</div>
          <div class="text-sm text-gray-500">Born at {{ row.dob }}</div>
          <div class="text-sm text-gray-500">{{ row.gender }}</div>
          <div class="text-sm text-gray-500">Created {{ row.created_at }}</div>
          <div class="text-sm text-gray-500">Last updated {{ row.updated_at }}</div>
        </div>

        <div class="text-sm text-blue-600">
          <a href="#" class="mr-2">Edit</a>|
          <a href="#" class="ml-2 text-red-600">Delete</a>
        </div>
        <div class="shrink-0 w-64 h-40">
          <img :src="row['picture']" class="w-full h-full rounded-r-2xl object-cover" />
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewType === 'grid'"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="(row, index) in paginatedData"
        :key="index"
        class="text-center p-2 rounded-2xl hover:bg-gray-100 transition"
      >
        <div class="bg-[#cdefff] p-5 rounded-2xl mb-2">
          <img :src="row['picture']" class="mx-auto rounded-full h-full w-full object-cover" />
        </div>
        <div class="font-semibold text-lg">{{ row.name }}</div>
        <div class="text-sm text-gray-500">{{ row.email }}</div>
        <div class="text-sm text-gray-500">Born at {{ row.dob }}</div>
        <div class="text-sm text-gray-500">{{ row.gender }}</div>
        <div class="text-sm text-gray-500 mt-2">Created {{ row.created_at }}</div>
        <div class="text-sm text-gray-500">Last updated {{ row.updated_at }}</div>
        <div class="mt-2 text-sm text-blue-600">
          <a href="#" class="mr-2">Edit</a>|
          <a href="#" class="ml-2 text-red-600">Delete</a>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing {{ start + 1 }} to {{ end }} of {{ filteredData.length }} entries
      </div>
      <div class="space-x-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="currentPage++"
          :disabled="end >= filteredData.length"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  type User = {
    name: string
    email: string
    dob: string
    gender: string
    picture: string
    created_at: string
    updated_at: string
  }

  type Column = {
    label: string
    key: string
    order?: boolean
  }

  const props = defineProps<{
    data: User[]
    viewType: 'list' | 'grid'
    rowsPerPage?: number
  }>()

  const sortTypes = ref<Column[]>([
    {
      label: 'Name Asc',
      key: 'name',
      order: true,
    },
    {
      label: 'Name Desc',
      key: 'name',
      order: false,
    },
    {
      label: 'Email Asc',
      key: 'email',
      order: true,
    },
    {
      label: 'Email Desc',
      key: 'email',
      order: false,
    },
    {
      label: 'Gender Asc',
      key: 'gender',
      order: true,
    },
    {
      label: 'Gender Desc',
      key: 'gender',
      order: false,
    },
    {
      label: 'Birth Asc',
      key: 'dob',
      order: true,
    },
    {
      label: 'Birth Desc',
      key: 'dob',
      order: false,
    },
    {
      label: 'Recently Created',
      key: 'created_at',
      order: true,
    },
    {
      label: 'Oldest Created',
      key: 'created_at',
      order: false,
    },
    {
      label: 'Recently Updated',
      key: 'updated_at',
      order: true,
    },
    {
      label: 'Oldest Updated',
      key: 'updated_at',
      order: false,
    },
  ])

  const filterTypes = ref<Column[]>([
    {
      label: 'Name',
      key: 'name',
    },
    {
      label: 'Email',
      key: 'email',
    },
  ])
  // Filtering
  const selectedSortKey = ref<Column>(sortTypes.value[0])
  const selectedFilterKey = ref<Column>(filterTypes.value[0])
  const searchTerm = ref<string>('')

  const filteredData = computed(() => {
    if (!searchTerm.value || !selectedFilterKey.value) return props.data

    return props.data.filter((row) => {
      const val = row[selectedFilterKey.value.key]
      return String(val).toLowerCase().includes(searchTerm.value.toLowerCase())
    })
  })

  // Pagination
  const currentPage = ref(1)
  const rowsPerPage = computed(() => props.rowsPerPage ?? 5)

  const start = computed(() => (currentPage.value - 1) * rowsPerPage.value)
  const end = computed(() => Math.min(start.value + rowsPerPage.value, filteredData.value.length))

  // Final mutated data
  const paginatedData = computed(() => {
    let result = [...filteredData.value]

    if (selectedSortKey.value) {
      const { key, order } = selectedSortKey.value

      result.sort((a, b) => {
        const aVal = a[key]
        const bVal = b[key]

        if (aVal == null) return order ? -1 : 1
        if (bVal == null) return order ? 1 : -1

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return order ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }

        return order
          ? aVal > bVal
            ? 1
            : aVal < bVal
              ? -1
              : 0
          : aVal < bVal
            ? 1
            : aVal > bVal
              ? -1
              : 0
      })
    }

    return result.slice(start.value, end.value)
  })
</script>

<style scoped></style>

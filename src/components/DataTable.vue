<template>
  <div class="space-y-4">
    <!-- Search & Filter -->
    <div class="flex justify-end items-center space-x-2">
      <div
        class="border border-gray-400 px-5 py-2 rounded-full text-sm cursor-pointer mr-auto hover:bg-green-200 hover:border-green-500 transition"
      >
        Export To CSV
      </div>
      <label class="text-sm">Search by:</label>
      <select
        v-model="selectedFilterKey"
        class="border border-gray-400 px-3 py-2 rounded-full text-sm"
      >
        <option v-for="col in filterableColumns" :key="col.key" :value="col.key">
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
    <div v-if="viewType === 'list'" class="overflow-x-auto rounded-md border border-gray-200">
      <table class="min-w-full table-auto text-left">
        <thead class="h-16">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="sortBy(column.key)"
              class="cursor-pointer p-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              {{ column.label }}
              <span v-if="sort.key === column.key">
                {{ sort.asc ? '▲' : '▼' }}
              </span>
            </th>
            <th class="p-3 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in paginatedData"
            :key="index"
            class="border-t border-gray-200 hover:bg-gray-50"
          >
            <td v-for="column in columns" :key="column.key" class="p-3">
              <slot :name="`cell-${column.key}`" :value="row[column.key]" :row="row">
                {{ row[column.key] }}
              </slot>
            </td>
            <td class="p-3 text-blue-600">
              <a href="#" class="mr-2">Edit</a>|
              <a href="#" class="ml-2 text-red-600">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewType === 'grid'"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="(row, index) in paginatedData"
        :key="index"
        class="rounded-lg bg-[#f7d5c3] p-4 text-center cursor-pointer"
      >
        <slot name="cell-profilePicture" :value="row['profilePicture']" :row="row">
          <img
            :src="row['profilePicture']"
            class="mx-auto mb-2 h-28 w-28 rounded-full object-cover"
          />
        </slot>
        <div class="font-semibold text-lg">{{ row.name }}</div>
        <div class="text-sm text-gray-700">{{ row.email }}</div>
        <div class="text-sm text-gray-700">{{ row.gender }}, Born {{ row.dob.split('-')[0] }}</div>
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

  type Column = {
    label: string
    key: string
  }

  const props = defineProps<{
    columns: Column[]
    data: Record<string, any>[]
    filterableColumns: Column[]
    viewType: 'list' | 'grid'
    rowsPerPage?: number
  }>()

  // Sorting
  const sort = ref<{ key: string; asc: boolean }>({
    key: props.columns[0]?.key || '',
    asc: true,
  })

  const sortBy = (key: string) => {
    if (sort.value.key === key) {
      sort.value.asc = !sort.value.asc
    } else {
      sort.value.key = key
      sort.value.asc = true
    }
  }

  // Filtering
  const selectedFilterKey = ref<string>(props.filterableColumns[0]?.key || '')
  const searchTerm = ref<string>('')

  const filteredData = computed(() => {
    if (!searchTerm.value || !selectedFilterKey.value) return props.data

    return props.data.filter((row) => {
      const val = row[selectedFilterKey.value]
      return String(val).toLowerCase().includes(searchTerm.value.toLowerCase())
    })
  })

  // Pagination
  const currentPage = ref(1)
  const rowsPerPage = computed(() => props.rowsPerPage ?? 5)

  const start = computed(() => (currentPage.value - 1) * rowsPerPage.value)
  const end = computed(() => Math.min(start.value + rowsPerPage.value, filteredData.value.length))

  const sortedData = computed(() => {
    return [...filteredData.value].sort((a, b) => {
      const valA = a[sort.value.key]
      const valB = b[sort.value.key]

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sort.value.asc ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
      return 0
    })
  })

  const paginatedData = computed(() => sortedData.value.slice(start.value, end.value))
</script>

<style scoped>
  th,
  td {
    white-space: nowrap;
  }
</style>

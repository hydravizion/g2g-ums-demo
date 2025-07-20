<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { User } from '../interfaces/user'
  import { format, formatDistanceToNow } from 'date-fns'
  import { exportToCSV, fallbackUrlCreator } from '../utils'
  import { deleteUser } from '../services/firebase'
  import router from '../router/router'

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
      order: false,
    },
    {
      label: 'Oldest Created',
      key: 'created_at',
      order: true,
    },
    {
      label: 'Recently Updated',
      key: 'updated_at',
      order: false,
    },
    {
      label: 'Oldest Updated',
      key: 'updated_at',
      order: true,
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
  const fallbackImg = '/default-dp.png'

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

  const sortedAndFilteredData = computed(() => {
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

    return result
  })

  const paginatedData = computed(() => {
    return sortedAndFilteredData.value.slice(start.value, end.value)
  })

  function handleExportCSV() {
    const dateTimeNow = format(new Date(), 'yyyy-MM-dd HH_mm_ss')
    exportToCSV(sortedAndFilteredData.value, `UserList-${dateTimeNow}.csv`)
  }

  function onClickEdit(id: string) {
    router.push(`/edit-user/${id}`)
  }

  async function onClickDelete(user: User) {
    if (
      confirm(
        `Are you sure you want to delete this user? - ${user.name} (The data will be lost forever!)`
      )
    )
      try {
        await deleteUser(user.id)
        router.go(0)
      } catch (error) {
        alert(error)
      }
  }

  const timeAgo = (dateString: string | Date): string => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  const onImgError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = fallbackImg
  }
</script>
<template>
  <div class="space-y-4">
    <!-- Search & Filter -->
    <div class="flex justify-end items-center space-x-2">
      <div
        class="border border-gray-400 px-5 py-2 rounded-full text-sm cursor-pointer mr-auto hover:bg-green-200 hover:border-green-500 transition"
        @click="handleExportCSV"
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
    <div v-if="paginatedData.length === 0" class="flex justify-center items-center w-full h-20">
      <p class="my-auto">No Data available</p>
    </div>
    <!-- List View -->
    <div v-if="viewType === 'list'" class="flex flex-col max-w-full gap-y-6 rounded-md">
      <div
        v-for="(row, index) in paginatedData"
        :key="index"
        class="flex flex-row w-full items-center rounded-2xl border border-gray-200 shadow text-center gap-x-4 hover:bg-gray-100 transition"
      >
        <div class="flex flex-col text-start px-6 flex-1 min-w-0">
          <div class="font-semibold text-lg truncate">{{ row.name }}</div>
          <div class="text-sm text-gray-500 truncate">{{ row.email }}</div>
          <div class="text-sm text-gray-500 truncate">Born at {{ row.dob }}</div>
          <div class="text-sm text-gray-500 truncate">{{ row.gender }}</div>
          <div class="text-sm text-gray-500 truncate">Created {{ timeAgo(row.created_at) }}</div>
          <div class="text-sm text-gray-500 truncate">
            Last updated {{ timeAgo(row.updated_at) }}
          </div>
        </div>

        <div class="shrink-0 w-1/6 text-sm text-blue-600 text-nowrap">
          <a href="#" class="mr-2" @click="onClickEdit(row.id)">Edit</a>|
          <a href="#" class="ml-2 text-red-600" @click="onClickDelete(row)">Delete</a>
        </div>

        <div
          class="flex items-center justify-center bg-gray-50 shrink-0 w-64 h-40 rounded-r-2xl overflow-hidden"
        >
          <img
            :src="row.picture"
            class="w-full h-full object-cover"
            @error="fallbackUrlCreator($event, row.name)"
          />
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
        class="flex flex-col text-center p-2 border border-gray-200 shadow rounded-2xl hover:bg-gray-100 transition"
      >
        <div class="bg-gray-100 p-5 rounded-2xl mb-2">
          <img
            :src="row.picture"
            class="mx-auto rounded-full h-full w-full object-cover"
            @error="fallbackUrlCreator($event, row.name)"
          />
        </div>
        <div class="font-semibold text-lg truncate">{{ row.name }}</div>
        <div class="text-sm text-gray-500 truncate">{{ row.email }}</div>
        <div class="text-sm text-gray-500 truncate">Born at {{ row.dob }}</div>
        <div class="text-sm text-gray-500 truncate">{{ row.gender }}</div>
        <div class="text-sm text-gray-500 mt-2">Created {{ timeAgo(row.created_at) }}</div>
        <div class="text-sm text-gray-500">Last updated {{ timeAgo(row.updated_at) }}</div>
        <div class="mt-auto text-sm text-blue-600">
          <a href="#" class="mr-2" @click="onClickEdit(row.id)">Edit</a>|
          <a href="#" class="ml-2 text-red-600" @click="onClickDelete(row)">Delete</a>
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
          class="px-3 py-1 border rounded cursor-pointer hover:bg-gray-200 hover:disabled:bg-transparent disabled:cursor-auto disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="currentPage++"
          :disabled="end >= filteredData.length"
          class="px-3 py-1 border rounded cursor-pointer hover:bg-gray-200 hover:disabled:bg-transparent disabled:cursor-auto disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

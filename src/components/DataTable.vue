<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { User } from '../interfaces/user'
  import { format, formatDistanceToNow } from 'date-fns'
  import { exportToCSV, fallbackUrlCreator } from '../utils'
  import { deleteUser } from '../services/firebase'
  import {
    PencilSquareIcon,
    TrashIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
  } from '@heroicons/vue/24/solid'
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
    <div class="flex flex-col gap-y-2 md:flex-row justify-end items-center space-x-2">
      <div class="flex flex-row gap-x-2 items-center">
        <label class="text-sm">Search by:</label>
        <div class="relative">
          <select
            v-model="selectedFilterKey"
            class="bg-gray-200 border border-gray-300 px-3 py-2 pr-8 rounded-full text-sm cursor-pointer appearance-none"
          >
            <option v-for="col in filterTypes" :key="col.key" :value="col">
              {{ col.label }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search..."
          class="bg-gray-200 text-gray-600 px-3 py-2 rounded-full text-sm"
        />
      </div>

      <div class="flex flex-row gap-x-2 items-center">
        <label class="text-sm">Sort by:</label>

        <div class="relative">
          <select
            v-model="selectedSortKey"
            class="bg-gray-200 text-gray-600 px-3 py-2 pr-8 rounded-full text-sm cursor-pointer appearance-none"
          >
            <option v-for="col in sortTypes" :key="col.key + col.order" :value="col">
              {{ col.label }}
            </option>
          </select>

          <div class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-emerald-200 text-green-700 px-5 py-2 rounded-full text-sm cursor-pointer ml-auto hover:bg-green-700 hover:text-emerald-200 transition"
        @click="handleExportCSV"
      >
        Export To CSV
      </div>
    </div>
    <div v-if="paginatedData.length === 0" class="flex justify-center items-center w-full h-20">
      <p class="my-auto">No Data available</p>
    </div>
    <!-- List View -->
    <div v-if="viewType === 'list'" class="flex flex-col max-w-full gap-y-6 rounded-md">
      <div
        v-for="(row, index) in paginatedData"
        :key="index"
        class="flex flex-row w-full md:items-center px-2 py-2 md:px-10 rounded-2xl border border-gray-200 shadow text-center gap-x-4 hover:bg-gray-100 transition"
      >
        <div
          class="flex justify-center bg-gray-50 shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden"
        >
          <img
            :src="row.picture"
            class="w-full h-full object-cover"
            @error="fallbackUrlCreator($event, row.name)"
          />
        </div>
        <div class="flex flex-col text-start flex-1 min-w-0">
          <div class="font-semibold text-lg truncate">{{ row.name }}</div>
          <div class="text-sm text-gray-500 truncate">{{ row.email }}</div>
          <div class="text-sm text-gray-500 truncate">Born at {{ row.dob }}</div>
          <div class="text-sm text-gray-500 truncate">{{ row.gender }}</div>
          <div class="text-sm text-gray-500 truncate">Created {{ timeAgo(row.created_at) }}</div>
          <div class="text-sm text-gray-500 truncate">
            Last updated {{ timeAgo(row.updated_at) }}
          </div>
        </div>

        <div class="flex flex-row items-center gap-x-5 text-sm text-blue-600 text-nowrap mx-2">
          <PencilSquareIcon
            class="h-5 w-5 text-blue-600 hover:text-blue-400 cursor-pointer"
            @click="onClickEdit(row.id)"
          />
          <TrashIcon
            class="h-5 w-5 text-red-600 hover:text-red-400 cursor-pointer"
            @click="onClickDelete(row)"
          />
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewType === 'grid'"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
        <div class="text-sm text-gray-500">{{ row.gender }}</div>
        <div class="text-sm text-gray-500 mt-2">Created {{ timeAgo(row.created_at) }}</div>
        <div class="text-sm text-gray-500">Last updated {{ timeAgo(row.updated_at) }}</div>
        <div
          class="flex flex-row mt-auto justify-center items-center gap-x-5 text-sm text-blue-600 text-nowrap mx-2"
        >
          <PencilSquareIcon
            class="h-5 w-5 text-blue-600 hover:text-blue-400 cursor-pointer"
            @click="onClickEdit(row.id)"
          />
          <TrashIcon
            class="h-5 w-5 text-red-600 hover:text-red-400 cursor-pointer"
            @click="onClickDelete(row)"
          />
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing {{ start + 1 }} to {{ end }} of {{ filteredData.length }} entries
      </div>
      <div class="flex flex-row gap-x-5">
        <ChevronLeftIcon
          @click="currentPage--"
          class="h-6 w-6 cursor-pointer rounded-full hover:bg-indigo-200"
          :class="{ 'pointer-events-none opacity-50': currentPage === 1 }"
        />
        <ChevronRightIcon
          @click="currentPage++"
          class="h-6 w-6 cursor-pointer rounded-full hover:bg-indigo-200"
          :class="{ 'pointer-events-none opacity-50': end >= filteredData.length }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

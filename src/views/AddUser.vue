<script setup lang="ts">
  import { ref } from 'vue'
  import { format } from 'date-fns'
  import { createUser } from '../services/firebase'
  import router from '../router/router'

  // Form inputs
  const nameInput = ref('')
  const emailInput = ref('')
  const genderInput = ref('')
  const dobInput = ref('')
  const pictureInput = ref('')

  const todayDate = format(new Date(), 'yyyy-MM-dd')

  // Validation errors
  const errors = ref<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}

    if (!nameInput.value) e.name = 'Name is required'
    if (!emailInput.value) {
      e.email = 'Email is required'
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailInput.value)) {
      e.email = 'Invalid email format'
    }

    if (!genderInput.value) e.gender = 'Gender is required'
    if (!dobInput.value) e.dob = 'Date of birth is required'
    if (pictureInput.value && !/^https?:\/\/.+/.test(pictureInput.value)) {
      e.picture = 'Invalid URL'
    }

    errors.value = e
    return Object.keys(e).length === 0
  }

  const clearEntries = () => {
    nameInput.value = ''
    emailInput.value = ''
    genderInput.value = ''
    dobInput.value = ''
    pictureInput.value = ''
    errors.value = {}
  }

  const backToDashboard = () => {
    router.push('/dashboard')
  }

  const submit = async () => {
    if (!validate()) return

    try {
      const now = new Date()

      await createUser({
        name: nameInput.value,
        email: emailInput.value,
        gender: genderInput.value,
        dob: format(new Date(dobInput.value), 'yyyy-MM-dd'),
        picture: pictureInput.value,
        created_at: format(now, 'yyyy-MM-dd HH:mm:ss'),
        updated_at: format(now, 'yyyy-MM-dd HH:mm:ss'),
      })

      clearEntries()
      alert('Successfully added user. Navigate to dashboard to see the list.')
    } catch (e) {
      alert('Error: ' + e)
    }
  }
</script>

<template>
  <div class="flex justify-center">
    <div class="flex flex-col justify-center py-10 px-6 gap-y-5 w-full max-w-md">
      <p class="font-bold text-2xl">Create New User</p>

      <!-- Name -->
      <div class="flex flex-col gap-y-2">
        <label for="nameinput">Name <span class="text-red-500">*</span></label>
        <input
          id="nameinput"
          v-model="nameInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
          placeholder="Enter Name"
          :maxlength="255"
        />
        <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-y-2">
        <label for="emailinput">Email <span class="text-red-500">*</span></label>
        <input
          id="emailinput"
          v-model="emailInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
          placeholder="Enter Email"
          :maxlength="255"
        />
        <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
      </div>

      <!-- Gender -->
      <div class="flex flex-col gap-y-2">
        <label for="gender">Gender <span class="text-red-500">*</span></label>
        <select
          id="gender"
          v-model="genderInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
        >
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Gender Not Specified">Gender Not Specified</option>
        </select>
        <p v-if="errors.gender" class="text-red-500 text-sm">{{ errors.gender }}</p>
      </div>

      <!-- Birthday -->
      <div class="flex flex-col gap-y-2">
        <label for="birthday">Birthday <span class="text-red-500">*</span></label>
        <input
          id="birthday"
          type="date"
          v-model="dobInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
          :max="todayDate"
        />
        <p v-if="errors.dob" class="text-red-500 text-sm">{{ errors.dob }}</p>
      </div>

      <!-- Picture -->
      <div class="flex flex-col gap-y-2">
        <label for="picinput">Profile Picture URL</label>
        <input
          id="picinput"
          v-model="pictureInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
          placeholder="Enter Picture URL"
        />
        <p v-if="errors.picture" class="text-red-500 text-sm">{{ errors.picture }}</p>
      </div>

      <!-- Submit -->
      <div class="flex flex-row w-full justify-between">
        <div
          class="px-5 py-2 rounded-full text-sm cursor-pointer text-indigo-600 bg-indigo-200 hover:bg-indigo-600 hover:text-indigo-200 transition"
          @click="backToDashboard()"
        >
          Back to Dashboard
        </div>
        <div
          class="px-5 py-2 rounded-full text-sm cursor-pointer text-green-600 bg-green-200 hover:bg-green-600 hover:text-green-200 transition"
          @click="submit"
        >
          Submit
        </div>
      </div>
    </div>
  </div>
</template>

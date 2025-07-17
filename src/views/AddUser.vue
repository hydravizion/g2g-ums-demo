<script setup lang="ts">
  import { ref } from 'vue'
  import { createUser } from '../services/firebase'
  import { format } from 'date-fns'

  const nameInput = ref('')
  const emailInput = ref('')
  const genderInput = ref('')
  const dobInput = ref('')
  const pictureInput = ref('')

  const submit = async () => {
    if (
      nameInput.value &&
      emailInput.value &&
      genderInput.value &&
      dobInput.value &&
      pictureInput.value
    ) {
      try {
        const now = new Date()

        const res = await createUser({
          name: nameInput.value,
          email: emailInput.value,
          gender: genderInput.value,
          dob: format(new Date(dobInput.value), 'yyyy-MM-dd'),
          picture: pictureInput.value,
          created_at: format(now, 'yyyy-MM-dd HH:mm:ss'),
          updated_at: format(now, 'yyyy-MM-dd HH:mm:ss'),
        })
        clearEntries()
        alert('Succesfully Added user, navigate to dashboard user list to see')
      } catch (e) {
        alert(e)
      }
    } else {
      alert('Please fill all before submit!')
      return
    }
  }

  const clearEntries = () => {
    nameInput.value = ''
    emailInput.value = ''
    genderInput.value = ''
    dobInput.value = ''
    pictureInput.value = ''
  }
</script>

<template>
  <div class="flex justify-center">
    <div class="flex flex-col justify-center py-10 px-6 gap-y-5 w-full max-w-md">
      <p class="font-bold text-2xl">Create New User</p>

      <div class="flex flex-col gap-y-2">
        <label for="nameinput">Name</label>
        <input
          id="nameinput"
          v-model="nameInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
          placeholder="Enter Name"
        />
      </div>

      <div class="flex flex-col gap-y-2">
        <label for="emailinput">Email</label>
        <input
          id="emailinput"
          v-model="emailInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
          placeholder="Enter Email"
        />
      </div>

      <div class="flex flex-col gap-y-2">
        <label for="gender">Gender</label>
        <select
          id="gender"
          v-model="genderInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
        >
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="flex flex-col gap-y-2">
        <label for="birthday">Birthday</label>
        <input
          id="birthday"
          type="date"
          v-model="dobInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
        />
      </div>

      <div class="flex flex-col gap-y-2">
        <label for="picinput">Profile Picture URL</label>
        <input
          id="picinput"
          v-model="pictureInput"
          class="border border-gray-300 px-2 py-3 rounded-lg"
          placeholder="Enter Picture URL"
        />
      </div>
      <div
        class="border px-5 py-2 rounded-full text-sm cursor-pointer ml-auto text-green-600 border-green-600 hover:bg-green-200 hover:border-green-500 transition"
        @click="submit"
      >
        Submit
      </div>
    </div>
  </div>
</template>

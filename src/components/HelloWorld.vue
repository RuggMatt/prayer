<template>
  <v-container class="py-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Your prayer journal</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Prayer requests</h1>
      </div>

      <v-btn :loading="authLoading" variant="text" @click="signOut">Sign out</v-btn>
    </div>

    <v-card class="mx-auto mb-10 max-w-3xl p-6">
      <h2 class="mb-4 text-xl font-semibold">Add a request</h2>
      <v-text-field v-model="title" label="Title" />
      <v-textarea v-model="prayer" label="Prayer" />
      <p v-if="formError" class="mb-3 text-sm text-red-600">{{ formError }}</p>

      <v-btn
        block
        class="w-full"
        color="primary"
        :loading="saving"
        @click="addItem"
      >Save request</v-btn>
    </v-card>

    <p v-if="requestError" class="mb-6 text-sm text-red-600 dark:text-red-300">{{ requestError }}</p>
    <div v-if="requestLoading" class="py-12 text-center text-slate-500 dark:text-slate-300">Loading your requests...</div>

    <section v-else>
      <h2 class="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">Unanswered</h2>

      <div v-if="unanswered.length > 0" class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <v-card v-for="request in unanswered" :key="request.id" class="min-w-0">
          <v-card-title>{{ request.title }}</v-card-title>
          <v-card-subtitle>{{ formatDate(request.created_at) }}</v-card-subtitle>
          <v-card-text>{{ request.prayer }}</v-card-text>

          <v-card-actions>
            <v-btn color="red" :loading="activeRequestId === request.id" variant="text" @click="remove(request.id)">Delete</v-btn>
            <v-btn :loading="activeRequestId === request.id" variant="text" @click="answer(request.id)">Mark as answered</v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <p v-else class="rounded-xl bg-slate-100 p-6 text-slate-600 dark:bg-slate-800 dark:text-slate-200">No unanswered requests yet.</p>

      <h2 class="mb-4 mt-10 text-2xl font-semibold text-slate-900 dark:text-slate-100">Answered</h2>

      <div v-if="answered.length > 0" class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <v-card v-for="request in answered" :key="request.id" class="min-w-0">
          <v-card-title>{{ request.title }}</v-card-title>
          <v-card-subtitle>Answered {{ formatDate(request.answered_at!) }}</v-card-subtitle>
          <v-card-text>{{ request.prayer }}</v-card-text>

          <v-card-actions>
            <v-btn color="red" :loading="activeRequestId === request.id" variant="text" @click="remove(request.id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <p v-else class="rounded-xl bg-slate-100 p-6 text-slate-600 dark:bg-slate-800 dark:text-slate-200">Answered prayers will appear here.</p>
    </section>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useAuth } from '@/composables/useAuth'
  import { usePrayerRequests } from '@/composables/usePrayerRequests'

  const { loading: authLoading, signOut } = useAuth()
  const {
    unanswered,
    answered,
    loading: requestLoading,
    errorMessage: requestError,
    loadRequests,
    addPrayerRequest,
    removePrayerRequest,
    markPrayerAnswered,
  } = usePrayerRequests()

  const title = ref('')
  const prayer = ref('')
  const saving = ref(false)
  const activeRequestId = ref('')
  const formError = ref('')

  onMounted(loadRequests)

  async function addItem () {
    formError.value = ''
    if (!title.value.trim() || !prayer.value.trim()) {
      formError.value = 'Add a title and prayer before saving.'
      return
    }

    saving.value = true
    try {
      await addPrayerRequest(title.value, prayer.value)
      title.value = ''
      prayer.value = ''
    } catch (error) {
      formError.value = error instanceof Error ? error.message : 'Unable to save this request.'
    } finally {
      saving.value = false
    }
  }

  async function remove (id: string) {
    activeRequestId.value = id
    try {
      await removePrayerRequest(id)
    } finally {
      activeRequestId.value = ''
    }
  }

  async function answer (id: string) {
    activeRequestId.value = id
    try {
      await markPrayerAnswered(id)
    } finally {
      activeRequestId.value = ''
    }
  }

  function formatDate (date: string) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))
  }
</script>

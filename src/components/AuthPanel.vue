<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12 dark:bg-slate-950">
    <v-card class="w-full max-w-md p-6 sm:p-8">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Prayerful</p>
      <h1 class="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ isSignUp ? 'Create your account' : 'Welcome back' }}</h1>
      <p class="mt-2 text-slate-600 dark:text-slate-300">{{ isSignUp ? 'Your prayer requests will be private to you.' : 'Return to the requests you are carrying.' }}</p>

      <form class="mt-8 space-y-2" @submit.prevent="submit">
        <v-text-field v-model="email" autocomplete="email" label="Email" type="email" />
        <v-text-field v-model="password" :autocomplete="isSignUp ? 'new-password' : 'current-password'" label="Password" type="password" />
        <p v-if="errorMessage" class="py-2 text-sm text-red-600 dark:text-red-300">{{ errorMessage }}</p>
        <p v-if="confirmationMessage" class="py-2 text-sm text-emerald-700 dark:text-emerald-300">{{ confirmationMessage }}</p>

        <v-btn class="mt-4 w-full" color="primary" :loading="loading" type="submit">
          {{ isSignUp ? 'Create account' : 'Sign in' }}
        </v-btn>
      </form>

      <button class="mt-6 w-full text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" type="button" @click="toggleMode">
        {{ isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account' }}
      </button>

      <button class="mt-4 w-full text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" type="button" @click="$emit('back')">
        Back to overview
      </button>
    </v-card>
  </main>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useAuth } from '@/composables/useAuth'

  defineEmits<{ back: [] }>()

  const { loading, errorMessage, signIn, signUp } = useAuth()
  const email = ref('')
  const password = ref('')
  const isSignUp = ref(false)
  const confirmationMessage = ref('')

  function toggleMode () {
    isSignUp.value = !isSignUp.value
    confirmationMessage.value = ''
  }

  async function submit () {
    confirmationMessage.value = ''

    try {
      if (isSignUp.value) {
        await signUp(email.value, password.value)
        confirmationMessage.value = 'Account created. Check your email if confirmation is enabled.'
      } else {
        await signIn(email.value, password.value)
      }
    } catch {
      // The composable exposes the provider error beside the form.
    }
  }
</script>

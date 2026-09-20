<template>
  <HelloWorld v-if="session" />
  <AuthPanel v-else-if="showAuth" @back="showAuth = false" />
  <LandingPage v-else @get-started="showAuth = true" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import AuthPanel from '@/components/AuthPanel.vue'
  import HelloWorld from '@/components/HelloWorld.vue'
  import LandingPage from '@/components/LandingPage.vue'
  import { useAuth } from '@/composables/useAuth'

  const { session } = useAuth()
  const showAuth = ref(false)
</script>

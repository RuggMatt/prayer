import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'

const session = ref<Session | null>(null)
const initialized = ref(false)

async function initialize () {
  if (initialized.value) {
    return
  }

  initialized.value = true

  if (!supabase) {
    return
  }

  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw error
  }

  session.value = data.session

  supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession) => {
    session.value = nextSession
  })
}

export function useAuth () {
  const loading = ref(false)
  const errorMessage = ref('')

  onMounted(() => {
    initialize().catch(error => {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to restore your session.'
    })
  })

  async function signIn (email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
    }

    loading.value = true
    errorMessage.value = ''

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        throw error
      }
      session.value = data.session
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to sign in.'
      throw error
    } finally {
      loading.value = false
    }
  }

  async function signUp (email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
    }

    loading.value = true
    errorMessage.value = ''

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        throw error
      }
      session.value = data.session
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to create your account.'
      throw error
    } finally {
      loading.value = false
    }
  }

  async function signOut () {
    if (!supabase) {
      return
    }

    loading.value = true
    errorMessage.value = ''

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to sign out.'
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    session,
    user: session.value?.user as User | undefined,
    loading,
    errorMessage,
    initialize,
    signIn,
    signUp,
    signOut,
  }
}

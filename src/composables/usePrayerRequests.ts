import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabase'

export interface PrayerRequest {
  id: string
  title: string
  prayer: string
  created_at: string
  answered_at: string | null
}

const requests = ref<PrayerRequest[]>([])
const loading = ref(false)
const errorMessage = ref('')

export function usePrayerRequests () {
  const unanswered = computed(() => requests.value.filter(request => !request.answered_at))
  const answered = computed(() => requests.value.filter(request => request.answered_at))

  async function loadRequests () {
    if (!supabase) {
      return
    }

    loading.value = true
    errorMessage.value = ''

    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('id, title, prayer, created_at, answered_at')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }
      requests.value = data ?? []
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to load your prayer requests.'
    } finally {
      loading.value = false
    }
  }

  async function addPrayerRequest (title: string, prayer: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured.')
    }

    const { data, error } = await supabase
      .from('prayer_requests')
      .insert({ title: title.trim(), prayer: prayer.trim() })
      .select('id, title, prayer, created_at, answered_at')
      .single()

    if (error) {
      throw error
    }
    if (data) {
      requests.value.unshift(data)
    }
  }

  async function removePrayerRequest (id: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured.')
    }

    const { error } = await supabase.from('prayer_requests').delete().eq('id', id)
    if (error) {
      throw error
    }
    requests.value = requests.value.filter(request => request.id !== id)
  }

  async function markPrayerAnswered (id: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured.')
    }

    const { data, error } = await supabase
      .from('prayer_requests')
      .update({ answered_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, title, prayer, created_at, answered_at')
      .single()

    if (error) {
      throw error
    }
    requests.value = requests.value.map(request => request.id === id ? data : request)
  }

  return {
    requests,
    unanswered,
    answered,
    loading,
    errorMessage,
    loadRequests,
    addPrayerRequest,
    removePrayerRequest,
    markPrayerAnswered,
  }
}

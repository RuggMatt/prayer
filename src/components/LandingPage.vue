<template>
  <main class="min-h-screen bg-slate-950 text-white">
    <div class="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
      <section>
        <p class="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">A quieter way to remember</p>
        <h1 class="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">Keep the people and promises on your heart close.</h1>
        <p class="mt-6 max-w-xl text-lg leading-8 text-slate-300">Prayerful gives you one calm place to write prayer requests, return to them, and remember when prayers have been answered.</p>

        <button class="mt-9 rounded-full bg-amber-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-200" type="button" @click="$emit('get-started')">
          Get started
        </button>
      </section>

      <section class="rounded-[2rem] border border-white/10 bg-white/10 p-7 shadow-2xl backdrop-blur sm:p-10">
        <p class="text-4xl">✦</p>
        <h2 class="mt-8 text-2xl font-semibold">A simple rhythm</h2>

        <div class="mt-8 space-y-6 text-slate-300">
          <div class="flex gap-4">
            <span class="text-amber-300">01</span>
            <p>Capture a request before it slips away.</p>
          </div>

          <div class="flex gap-4">
            <span class="text-amber-300">02</span>
            <p>Keep it with you wherever you sign in.</p>
          </div>

          <div class="flex gap-4">
            <span class="text-amber-300">03</span>
            <p>Mark answered prayers and make space for gratitude.</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang="ts" setup>
  defineEmits<{ 'get-started': [] }>()
</script>

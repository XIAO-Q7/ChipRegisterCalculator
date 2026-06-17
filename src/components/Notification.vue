<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRegisterStore } from '../stores/register'

const store = useRegisterStore()

function close() {
  store.errorMessage = null
}

function handleGlobalClick(e: MouseEvent) {
  if (store.errorMessage) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('mousedown', handleGlobalClick)
})

onUnmounted(() => {
  window.removeEventListener('mousedown', handleGlobalClick)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="store.errorMessage" 
      class="fixed top-8 left-1/2 -translate-x-1/2 z-[100] min-w-[320px] max-w-md"
      @mousedown.stop
    >
      <div class="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-red-400">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="font-bold text-sm">{{ store.errorMessage }}</p>
        </div>
        <button @click="close" class="ml-4 hover:bg-white/20 p-1 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

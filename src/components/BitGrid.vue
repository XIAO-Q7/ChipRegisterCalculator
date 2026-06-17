<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRegisterStore } from '../stores/register'

const store = useRegisterStore()

const isDragging = ref(false)
const dragStart = ref<number | null>(null)
const dragEnd = ref<number | null>(null)

const bitRows = computed(() => {
  const rows = []
  const currentSize = store.activeRegister.bitSize
  for (let i = Math.ceil(currentSize / 16) * 16 - 16; i >= 0; i -= 16) {
    const row = []
    for (let j = i + 15; j >= i; j--) {
      if (j < currentSize) row.push(j)
      else row.push(null)
    }
    rows.push(row)
  }
  return rows
})

function handleMouseDown(index: number) {
  isDragging.value = true
  dragStart.value = index
  dragEnd.value = index
}

function handleMouseEnter(index: number) {
  if (isDragging.value) dragEnd.value = index
}

function handleMouseUp() {
  if (isDragging.value && dragStart.value !== null && dragEnd.value !== null) {
    if (dragStart.value === dragEnd.value) {
      store.toggleBit(dragStart.value)
    } else {
      const start = dragStart.value
      const end = dragEnd.value
      store.addGroup(`Group ${store.activeRegister.groups.length + 1}`, start, end)
    }
  }
  isDragging.value = false
  dragStart.value = null
  dragEnd.value = null
}

function isBitInRange(index: number) {
  if (!isDragging.value || dragStart.value === null || dragEnd.value === null) return false
  const min = Math.min(dragStart.value, dragEnd.value)
  const max = Math.max(dragStart.value, dragEnd.value)
  return index >= min && index <= max
}

function getGroup(index: number) {
  return store.activeRegister.groups.find(g => index >= g.start && index <= g.end)
}

onMounted(() => {
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto border border-gray-100 dark:border-gray-700">
    <div class="mb-6 flex items-baseline justify-between border-b dark:border-gray-700 pb-3">
      <div class="flex items-baseline gap-3">
        <h2 class="text-xl font-black text-gray-800 dark:text-white tracking-tight">{{ store.activeRegister.name }}</h2>
        <span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-mono text-xs rounded border border-blue-100 dark:border-blue-800">
          {{ store.activeRegister.address }}
        </span>
      </div>
      <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded">BITS VIEW</div>
    </div>

    <div class="flex flex-col gap-4 min-w-[800px]">
      <div v-for="(row, rowIndex) in bitRows" :key="rowIndex" class="grid grid-cols-16 gap-1">
        <div v-for="(bitIdx, colIndex) in row" :key="bitIdx !== null ? bitIdx : 'empty-' + colIndex" class="flex flex-col items-center group relative h-16">
          <template v-if="bitIdx !== null">
            <div v-if="getGroup(bitIdx) && getGroup(bitIdx)?.end === bitIdx" class="absolute top-0 left-0 w-[400%] z-20 text-[9px] font-black px-1 pointer-events-none" :style="{ color: getGroup(bitIdx)?.color }">
              <span class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-[2px] rounded py-0.5 pr-1 truncate block">{{ getGroup(bitIdx)?.name }}</span>
            </div>
            <span class="text-[9px] text-gray-400 mb-0.5 font-mono mt-4 select-none">{{ bitIdx }}</span>
            
            <button
              @mousedown="handleMouseDown(bitIdx)"
              @mouseenter="handleMouseEnter(bitIdx)"
              class="w-full h-10 rounded-md border transition-all flex items-center justify-center font-mono text-lg select-none"
              :class="[
                store.activeRegister.bits[bitIdx] 
                  ? 'text-blue-600 dark:text-blue-400 font-black' 
                  : 'text-gray-400 dark:text-gray-500',
                'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600',
                isBitInRange(bitIdx) ? 'ring-2 ring-yellow-400 z-10' : ''
              ]"
              :style="{
                borderColor: getGroup(bitIdx)?.color || '',
                borderWidth: getGroup(bitIdx) ? '2px' : '1px',
                // 置位时背景稍微加深一点点（极淡），或者完全不改
                backgroundColor: store.activeRegister.bits[bitIdx] ? 'rgba(59, 130, 246, 0.05)' : ''
              }"
            >
              {{ store.activeRegister.bits[bitIdx] }}
            </button>
          </template>
        </div>
      </div>
    </div>
    
    <div class="mt-4 text-[11px] text-gray-400 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
      <span class="opacity-70">操作：点击切换位，拖拽管理分组。</span>
      <div class="flex gap-3 items-center font-bold uppercase tracking-tighter">
        <div class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-white border border-blue-500 rounded-sm"></span><span class="text-blue-500">Set</span></div>
        <div class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-gray-50 border border-gray-200 rounded-sm"></span><span>Clr</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-cols-16 { grid-template-columns: repeat(16, minmax(0, 1fr)); }
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRegisterStore } from '../stores/register'

const store = useRegisterStore()
const customSize = ref(store.activeRegister.bitSize.toString())

const bitSizeOptions = [8, 16, 32, 64]

function handleBitSizeChange(size: number) {
  store.setBitSize(size)
  customSize.value = size.toString()
}

function handleCustomSizeInput() {
  const size = parseInt(customSize.value.replace(/[^0-9]/g, ''))
  if (!isNaN(size)) {
    store.setBitSize(size)
  }
}

watch(() => store.activeRegister.id, () => {
  customSize.value = store.activeRegister.bitSize.toString()
})

function filterHex(event: Event) {
  const input = event.target as HTMLInputElement
  const filtered = input.value.replace(/[^0-9a-fA-F]/g, '')
  if (input.value !== filtered) {
    input.value = filtered
    store.hexValue = filtered
  }
}

function filterDec(event: Event) {
  const input = event.target as HTMLInputElement
  const filtered = input.value.replace(/[^0-9]/g, '')
  if (input.value !== filtered) {
    input.value = filtered
    store.decValue = filtered
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 寄存器配置面板 (精简版) -->
    <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div class="flex justify-between items-center mb-6">
        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">属性配置 (Attributes)</label>
        <div v-if="store.mode === 'project'" class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-blue-500/20 uppercase tracking-tighter">
          Project Mode
        </div>
      </div>

      <div class="">
        <label class="block text-[10px] font-bold text-gray-400 mb-3 uppercase">修改寄存器位宽 (Bit Size)</label>
        <div class="flex flex-wrap items-center gap-3">
          <button
            v-for="size in bitSizeOptions"
            :key="size"
            @click="handleBitSizeChange(size)"
            class="px-5 py-2 rounded-lg font-bold transition-all text-sm"
            :class="store.activeRegister.bitSize === size 
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            {{ size }}位
          </button>
          <div class="flex items-center gap-2 ml-auto">
            <span class="text-xs text-gray-400 font-medium">自定义:</span>
            <input
              v-model="customSize"
              @input="handleCustomSizeInput"
              type="text"
              class="w-20 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 进制显示 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">HEX (16进制)</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xl">0x</span>
            <input
              v-model="store.hexValue"
              @input="filterHex"
              type="text"
              class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">DEC (10进制)</label>
          <input
            v-model="store.decValue"
            @input="filterDec"
            type="text"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
          />
        </div>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">BIN (2进制)</label>
          <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-sm break-all h-[54px] flex items-center shadow-inner leading-none">
            {{ store.binValue }}
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">OCT (8进制)</label>
          <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-xl h-[54px] flex items-center shadow-inner">
            {{ store.octValue }}
          </div>
        </div>
      </div>

      <div class="md:col-span-2 flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
        <div class="flex gap-6">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="radio" v-model="store.endianness" value="little" class="w-4 h-4 text-blue-500 focus:ring-blue-500" />
            <span class="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors">Little Endian</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="radio" v-model="store.endianness" value="big" class="w-4 h-4 text-blue-500 focus:ring-blue-500" />
            <span class="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors">Big Endian</span>
          </label>
        </div>
        <div class="text-sm text-gray-400 font-black tracking-widest uppercase">
          Width: {{ store.activeRegister.bitSize }} BITS
        </div>
      </div>
    </div>
  </div>
</template>

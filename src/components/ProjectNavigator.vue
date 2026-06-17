<script setup lang="ts">
import { ref } from 'vue'
import { useRegisterStore } from '../stores/register'

const store = useRegisterStore()
const newChipName = ref('')
const newRegName = ref('')
const newRegAddr = ref('0x0')

// 状态控制
const collapsedChips = ref<Record<string, boolean>>({})
const isAddingChip = ref(false)
const addingRegForChipId = ref<string | null>(null)

function toggleChip(id: string) {
  collapsedChips.value[id] = !collapsedChips.value[id]
}

function handleAddChip() {
  if (newChipName.value.trim()) {
    store.addChip(newChipName.value.trim())
    newChipName.value = ''
    isAddingChip.value = false
  }
}

function handleAddRegister(chipId: string) {
  if (newRegName.value.trim()) {
    store.addRegister(chipId, newRegName.value.trim(), newRegAddr.value.trim())
    newRegName.value = ''
    newRegAddr.value = '0x0'
    addingRegForChipId.value = null
    // 确保添加后是展开状态
    collapsedChips.value[chipId] = false
  }
}

function selectRegister(chipId: string, regId: string) {
  store.activeChipId = chipId
  store.activeRegisterId = regId
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden">
    <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
      <h3 class="font-bold text-xs uppercase tracking-wider text-gray-500">项目资源 (Project)</h3>
      <button 
        @click="store.mode = store.mode === 'simple' ? 'project' : 'simple'"
        class="text-[10px] px-2 py-1 rounded border-2 transition-all font-bold"
        :class="store.mode === 'project' 
          ? 'bg-blue-500 text-white border-blue-600 shadow-sm' 
          : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-600'"
      >
        {{ store.mode === 'project' ? 'PROJECT' : 'SIMPLE' }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="store.mode === 'simple'" class="text-center py-10 space-y-3 opacity-60">
        <div class="text-gray-300 dark:text-gray-600 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-[10px] text-gray-400 font-medium">SIMPLE 模式<br/>操作默认寄存器</p>
      </div>

      <div v-else class="space-y-4">
        <!-- 芯片列表 -->
        <div v-for="chip in store.chips" :key="chip.id" class="space-y-1">
          <div class="flex items-center justify-between group py-1">
            <button 
              @click="toggleChip(chip.id)"
              class="flex items-center gap-2 flex-1 text-left"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-3 w-3 transition-transform text-gray-400" 
                :class="{ '-rotate-90': collapsedChips[chip.id] }"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
              </svg>
              <span class="font-black text-xs text-gray-700 dark:text-gray-200 uppercase truncate">{{ chip.name }}</span>
            </button>
            <button 
              @click="addingRegForChipId = chip.id"
              class="opacity-0 group-hover:opacity-100 p-1 bg-blue-500 text-white rounded transition-all hover:bg-blue-600 shadow-sm"
              title="添加寄存器"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <!-- 寄存器列表 (可折叠) -->
          <div v-if="!collapsedChips[chip.id]" class="ml-1 border-l-2 border-gray-100 dark:border-gray-700 pl-3 space-y-1">
            <button 
              v-for="reg in chip.registers" 
              :key="reg.id"
              @click="selectRegister(chip.id, reg.id)"
              class="w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex justify-between items-center group relative overflow-hidden"
              :class="store.activeRegisterId === reg.id 
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'"
            >
              <div class="flex flex-col truncate pr-2">
                <span class="truncate">{{ reg.name }}</span>
                <span class="text-[9px] opacity-60 font-mono tracking-tighter">{{ reg.address }}</span>
              </div>
              <div v-if="store.activeRegisterId === reg.id" class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
            </button>

            <!-- 动态添加寄存器输入框 -->
            <div v-if="addingRegForChipId === chip.id" class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-2 border border-blue-100 dark:border-blue-900/30 shadow-inner">
              <input 
                v-model="newRegName"
                placeholder="寄存器名称..."
                class="w-full text-[10px] p-2 bg-white dark:bg-gray-800 border rounded outline-none focus:ring-1 focus:ring-blue-500"
                @keyup.enter="handleAddRegister(chip.id)"
              />
              <input 
                v-model="newRegAddr"
                placeholder="地址(如 0x00)"
                class="w-full text-[10px] p-2 bg-white dark:bg-gray-800 border rounded outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
              <div class="flex gap-1 pt-1">
                <button @click="addingRegForChipId = null" class="flex-1 text-[9px] py-1 bg-gray-200 dark:bg-gray-700 rounded font-bold">取消</button>
                <button @click="handleAddRegister(chip.id)" class="flex-1 text-[9px] py-1 bg-blue-500 text-white rounded font-bold">完成</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 添加芯片 -->
        <div class="pt-2">
          <button 
            v-if="!isAddingChip"
            @click="isAddingChip = true"
            class="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-[10px] font-bold text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all uppercase tracking-widest"
          >
            + Add New Chip
          </button>
          <div v-else class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 space-y-2 shadow-inner">
            <input 
              v-model="newChipName"
              placeholder="输入芯片名称..."
              class="w-full text-xs p-2 bg-white dark:bg-gray-800 border rounded outline-none focus:ring-1 focus:ring-blue-500 font-bold"
              @keyup.enter="handleAddChip"
            />
            <div class="flex gap-2">
              <button @click="isAddingChip = false" class="flex-1 text-[10px] py-1.5 bg-gray-200 dark:bg-gray-700 rounded font-bold">取消</button>
              <button @click="handleAddChip" class="flex-1 text-[10px] py-1.5 bg-blue-500 text-white rounded font-bold shadow-md shadow-blue-500/20">完成</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="min-w-0">
          <div class="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Current Target</div>
          <div class="text-[11px] font-mono truncate dark:text-gray-300 font-bold">
            {{ store.activeRegister.address }}
          </div>
        </div>
        <div class="h-8 w-8 rounded-lg bg-white dark:bg-gray-800 border flex items-center justify-center text-blue-500 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

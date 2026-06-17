<script setup lang="ts">
import { ref } from 'vue'
import { useRegisterStore, type BitGroup, type ValueMapping } from '../stores/register'

const store = useRegisterStore()

const editingMappings = ref<Record<string, boolean>>({})

function toggleMappingEdit(id: string) {
  editingMappings.value[id] = !editingMappings.value[id]
}

function addMapping(group: BitGroup) {
  group.mappings.push({ type: 'equal', value: '', label: '' })
}

function removeMapping(group: BitGroup, index: number) {
  group.mappings.splice(index, 1)
}

function isMappingActive(group: BitGroup, mapping: ValueMapping) {
  const currentValue = store.getGroupValue(group)
  if (mapping.type === 'equal') {
    try {
      const clean = mapping.value.trim().toLowerCase()
      const mVal = clean.startsWith('0x') ? BigInt(clean) : BigInt(clean)
      return mVal === currentValue
    } catch { return false }
  } else if (mapping.type === 'bit') {
    try {
      const bitOffset = parseInt(mapping.value.trim())
      return !isNaN(bitOffset) && (currentValue & (1n << BigInt(bitOffset))) !== 0n
    } catch { return false }
  }
  return false
}

// 核心功能：点击标签应用/取消配置 (Toggle)
function applyMapping(group: BitGroup, mapping: ValueMapping) {
  const currentValue = store.getGroupValue(group)
  
  if (mapping.type === 'equal') {
    try {
      const clean = mapping.value.trim().toLowerCase()
      const mVal = clean.startsWith('0x') ? BigInt(clean) : BigInt(clean)
      
      // Toggle 逻辑: 如果当前已经是这个值，则归零；否则设置为这个值
      if (currentValue === mVal) {
        store.updateGroupValue(group, 0n)
      } else {
        store.updateGroupValue(group, mVal)
      }
    } catch { alert('无效的映射值') }
  } else if (mapping.type === 'bit') {
    try {
      const bitOffset = parseInt(mapping.value.trim())
      if (!isNaN(bitOffset)) {
        // Toggle 逻辑: 位取反
        const newValue = currentValue ^ (1n << BigInt(bitOffset))
        store.updateGroupValue(group, newValue)
      }
    } catch { /* ignore */ }
  }
}

function handleHexInput(group: BitGroup, event: Event) {
  const target = event.target as HTMLInputElement
  const filtered = target.value.replace(/[^0-9a-fA-F]/g, '')
  if (target.value !== filtered) target.value = filtered
  try {
    const n = BigInt('0x' + (filtered || '0'))
    store.updateGroupValue(group, n)
  } catch (e) {
    console.error('Invalid group hex input', e)
  }
}

function handleDecInput(group: BitGroup, event: Event) {
  const target = event.target as HTMLInputElement
  const filtered = target.value.replace(/[^0-9]/g, '')
  if (target.value !== filtered) target.value = filtered
  try {
    const n = BigInt(filtered || '0')
    store.updateGroupValue(group, n)
  } catch (e) {
    console.error('Invalid group decimal input', e)
  }
}
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full overflow-y-auto min-h-[500px]">
    <h3 class="text-lg font-bold mb-4 dark:text-white border-b pb-2 flex justify-between items-center text-center">
      <span>位分组 (Bit Groups)</span>
      <span class="text-xs font-normal text-gray-400">#{{ store.activeRegister.groups.length }}</span>
    </h3>
    
    <div v-if="store.activeRegister.groups.length === 0" class="text-gray-400 text-sm italic py-8 text-center">
      在位网格上拖拽来创建分组。
    </div>

    <div class="space-y-6">
      <div 
        v-for="group in store.activeRegister.groups" 
        :key="group.id"
        class="p-4 border-2 rounded-lg transition-all relative group-card bg-opacity-5"
        :style="{ borderColor: group.color, backgroundColor: group.color + '08' }"
      >
        <div class="flex justify-between items-start mb-3">
          <input 
            v-model="group.name"
            class="bg-transparent font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-300 rounded px-1 w-2/3"
            placeholder="分组名称"
          />
          <div class="flex gap-1">
            <button 
              @click="toggleMappingEdit(group.id)"
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :class="editingMappings[group.id] ? 'text-blue-500' : 'text-gray-400'"
              title="配置备注规则"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
            <button 
              @click="store.removeGroup(group.id)"
              class="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="删除分组"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 逆向点选配置按钮组 -->
        <div class="flex flex-wrap gap-1 mb-3" v-if="group.mappings.length > 0">
          <button 
            v-for="(mapping, lIdx) in group.mappings"
            :key="lIdx"
            @click="applyMapping(group, mapping)"
            class="px-2 py-0.5 rounded text-[10px] font-bold transition-all border shadow-sm active:scale-95"
            :style="isMappingActive(group, mapping) ? {
              backgroundColor: group.color,
              borderColor: group.color,
              color: 'white'
            } : {
              backgroundColor: 'transparent',
              borderColor: group.color,
              color: group.color,
              opacity: 0.6
            }"
          >
            {{ mapping.label || (mapping.type === 'bit' ? 'Bit' + mapping.value : 'Val' + mapping.value) }}
          </button>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span class="font-mono bg-white dark:bg-gray-700 px-1 rounded border">[{{ group.end }}:{{ group.start }}]</span>
            <span class="italic text-[10px]">{{ group.end - group.start + 1 }} bits</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold text-gray-400 w-8">HEX</span>
            <div class="relative flex-1">
              <span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">0x</span>
              <input 
                :value="store.getGroupValue(group).toString(16).toUpperCase()"
                @input="handleHexInput(group, $event)"
                type="text"
                class="w-full pl-6 pr-2 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded font-mono text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold text-gray-400 w-8">DEC</span>
            <input 
              :value="store.getGroupValue(group).toString(10)"
              @input="handleDecInput(group, $event)"
              type="text"
              class="flex-1 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded font-mono text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div v-if="editingMappings[group.id]" class="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-gray-400 uppercase">备注规则 (Mappings)</span>
            <button @click="addMapping(group)" class="text-[10px] text-blue-500 hover:underline">+ 新增规则</button>
          </div>
          
          <div v-for="(mapping, idx) in group.mappings" :key="idx" class="space-y-1 p-2 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-100 dark:border-gray-700 group/map">
            <div class="flex items-center gap-2">
              <select v-model="mapping.type" class="text-[10px] bg-white dark:bg-gray-800 border rounded p-0.5 outline-none">
                <option value="equal">数值等于</option>
                <option value="bit">位置位(1)</option>
              </select>
              <input 
                v-model="mapping.value" 
                :placeholder="mapping.type === 'equal' ? '如 0x1' : '位偏移(如 0)'" 
                class="flex-1 text-[10px] p-1 bg-white dark:bg-gray-800 border rounded outline-none"
              />
              <button @click="removeMapping(group, idx)" class="text-gray-300 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input 
              v-model="mapping.label" 
              placeholder="显示备注" 
              class="w-full text-[10px] p-1 bg-white dark:bg-gray-800 border rounded outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group-card {
  transition: transform 0.2s ease;
}
.group-card:hover {
  transform: translateY(-2px);
}
</style>

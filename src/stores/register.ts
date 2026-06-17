import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Endianness = 'big' | 'little'

export interface ValueMapping {
  type: 'equal' | 'bit'
  value: string
  label: string
}

export interface BitGroup {
  id: string
  name: string
  start: number
  end: number
  color: string
  mappings: ValueMapping[]
}

export interface Register {
  id: string
  name: string
  address: string
  bitSize: number
  bits: number[]
  groups: BitGroup[]
}

export interface Chip {
  id: string
  name: string
  registers: Register[]
}

export const useRegisterStore = defineStore('register', () => {
  const mode = ref<'simple' | 'project'>('simple')
  const chips = ref<Chip[]>([])
  const activeChipId = ref<string | null>(null)
  const activeRegisterId = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)

  const simpleRegister = ref<Register>({
    id: 'simple',
    name: 'Default',
    address: '0x0',
    bitSize: 32,
    bits: new Array(32).fill(0),
    groups: []
  })

  const endianness = ref<Endianness>('little')
  let colorCounter = 0

  const activeRegister = computed(() => {
    if (mode.value === 'simple') return simpleRegister.value
    const chip = chips.value.find(c => c.id === activeChipId.value)
    if (!chip) return simpleRegister.value
    const reg = chip.registers.find(r => r.id === activeRegisterId.value)
    return reg || simpleRegister.value
  })

  // 核心同步逻辑: 依赖 activeRegister.bits 的变化
  const numericValue = computed(() => {
    const reg = activeRegister.value
    let val = 0n
    for (let i = 0; i < reg.bitSize; i++) {
      if (reg.bits[i]) {
        if (endianness.value === 'little') {
          val |= (1n << BigInt(i))
        } else {
          val |= (1n << BigInt(reg.bitSize - 1 - i))
        }
      }
    }
    return val
  })

  const hexValue = computed({
    get: () => numericValue.value.toString(16).toUpperCase().padStart(Math.ceil(activeRegister.value.bitSize / 4), '0'),
    set: (val: string) => {
      try {
        let cleanHex = val.replace(/[^0-9a-fA-F]/g, '')
        updateBitsFromValue(BigInt('0x' + (cleanHex || '0')))
      } catch (e) { console.error(e) }
    }
  })

  const decValue = computed({
    get: () => numericValue.value.toString(10),
    set: (val: string) => {
      try {
        let cleanDec = val.replace(/[^0-9]/g, '')
        updateBitsFromValue(BigInt(cleanDec || '0'))
      } catch (e) { console.error(e) }
    }
  })

  const binValue = computed(() => numericValue.value.toString(2).padStart(activeRegister.value.bitSize, '0'))
  const octValue = computed(() => numericValue.value.toString(8))

  function setError(msg: string) {
    errorMessage.value = msg
  }

  function toggleBit(index: number) {
    const reg = activeRegister.value
    if (index >= 0 && index < reg.bitSize) {
      reg.bits[index] = reg.bits[index] ? 0 : 1
    }
  }

  function updateBitsFromValue(val: bigint) {
    const reg = activeRegister.value
    for (let i = 0; i < reg.bitSize; i++) {
      if (endianness.value === 'little') {
        reg.bits[i] = Number((val >> BigInt(i)) & 1n)
      } else {
        reg.bits[i] = Number((val >> BigInt(reg.bitSize - 1 - i)) & 1n)
      }
    }
  }

  function addGroup(name: string, start: number, end: number) {
    const reg = activeRegister.value
    const s = Math.min(start, end)
    const e = Math.max(start, end)
    
    const exactMatchIndex = reg.groups.findIndex(g => g.start === s && g.end === e)
    if (exactMatchIndex !== -1) {
      reg.groups.splice(exactMatchIndex, 1)
      return true
    }

    if (reg.groups.some(g => s <= g.end && e >= g.start)) {
      setError('分组位范围不能重叠！')
      return false
    }

    reg.groups.push({
      id: Math.random().toString(36).substring(2, 9),
      name, start: s, end: e,
      color: `hsl(${(colorCounter++ * 137.5) % 360}, 70%, 50%)`,
      mappings: []
    })
    return true
  }

  function updateGroupValue(group: BitGroup, val: bigint) {
    const reg = activeRegister.value
    const length = group.end - group.start + 1
    const mask = (1n << BigInt(length)) - 1n
    const cleanVal = val & mask
    for (let i = 0; i < length; i++) {
      reg.bits[group.start + i] = Number((cleanVal >> BigInt(i)) & 1n)
    }
  }

  function removeGroup(id: string) {
    activeRegister.value.groups = activeRegister.value.groups.filter(g => g.id !== id)
  }

  function getGroupValue(group: BitGroup): bigint {
    const reg = activeRegister.value
    let val = 0n
    for (let i = 0; i < (group.end - group.start + 1); i++) {
      if (reg.bits[group.start + i]) val |= (1n << BigInt(i))
    }
    return val
  }

  function setBitSize(size: number) {
    const reg = activeRegister.value
    const newBits = new Array(size).fill(0)
    for (let i = 0; i < Math.min(reg.bits.length, size); i++) newBits[i] = reg.bits[i]
    reg.bitSize = size
    reg.bits = newBits
    reg.groups = reg.groups.filter(g => g.start < size)
    reg.groups.forEach(g => { if (g.end >= size) g.end = size - 1 })
  }

  function addChip(name: string) {
    const newChip = { id: Math.random().toString(36).substring(2, 9), name, registers: [] }
    chips.value.push(newChip)
    activeChipId.value = newChip.id
    return newChip
  }

  function addRegister(chipId: string, name: string, address: string) {
    const chip = chips.value.find(c => c.id === chipId)
    if (!chip) return
    const newReg = {
      id: Math.random().toString(36).substring(2, 9),
      name, address, bitSize: 32,
      bits: new Array(32).fill(0),
      groups: []
    }
    chip.registers.push(newReg)
    activeRegisterId.value = newReg.id
    return newReg
  }

  function exportConfig() {
    return JSON.stringify({
      mode: mode.value, chips: chips.value, simpleRegister: simpleRegister.value,
      endianness: endianness.value, activeChipId: activeChipId.value, activeRegisterId: activeRegisterId.value
    }, null, 2)
  }

  function importConfig(json: string) {
    try {
      const config = JSON.parse(json)
      if (config.mode) mode.value = config.mode
      if (config.chips) chips.value = config.chips
      if (config.simpleRegister) simpleRegister.value = config.simpleRegister
      if (config.endianness) endianness.value = config.endianness
      if (config.activeChipId) activeChipId.value = config.activeChipId
      if (config.activeRegisterId) activeRegisterId.value = config.activeRegisterId
      return true
    } catch (e) {
      setError('导入失败')
      return false
    }
  }

  return {
    mode, chips, activeChipId, activeRegisterId, activeRegister, errorMessage,
    endianness, numericValue, hexValue, decValue, binValue, octValue,
    setBitSize, toggleBit, updateBitsFromValue, addGroup, updateGroupValue,
    removeGroup, getGroupValue, addChip, addRegister, exportConfig, importConfig
  }
})

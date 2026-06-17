<script setup lang="ts">
import { ref } from 'vue'
import { useRegisterStore } from '../stores/register'

const store = useRegisterStore()
const showImportModal = ref(false)
const importText = ref('')

function handleExportClipboard() {
  const json = store.exportConfig()
  navigator.clipboard.writeText(json).then(() => {
    alert('配置已复制到剪切板！')
  })
}

function handleExportFile() {
  const json = store.exportConfig()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `register-config-${new Date().getTime()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleImport() {
  if (store.importConfig(importText.value)) {
    showImportModal.value = false
    importText.value = ''
    alert('配置导入成功！')
  }
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (store.importConfig(content)) {
        alert('文件导入成功！')
      }
    }
    reader.readAsText(file)
  }
}
</script>

<template>
  <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
    <label class="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">配置管理 (Config)</label>
    <div class="flex flex-wrap gap-3">
      <button 
        @click="handleExportClipboard"
        class="flex-1 min-w-[120px] px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        复制 JSON
      </button>
      
      <button 
        @click="handleExportFile"
        class="flex-1 min-w-[120px] px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        保存文件
      </button>

      <button 
        @click="showImportModal = true"
        class="flex-1 min-w-[120px] px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
        </svg>
        导入配置
      </button>

      <label class="flex-1 min-w-[120px] px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        选择文件
        <input type="file" @change="handleFileUpload" accept=".json" class="hidden" />
      </label>
    </div>

    <!-- 导入弹窗 -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
        <h4 class="text-xl font-bold mb-4 dark:text-white">粘贴 JSON 配置</h4>
        <textarea 
          v-model="importText"
          class="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4"
          placeholder='在此粘贴 {"bitSize": 32, ...}'
        ></textarea>
        <div class="flex justify-end gap-3">
          <button @click="showImportModal = false" class="px-6 py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold transition-all">取消</button>
          <button @click="handleImport" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-500/30">确认导入</button>
        </div>
      </div>
    </div>
  </div>
</template>

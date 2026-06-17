<script setup lang="ts">
import BitGrid from './components/BitGrid.vue'
import ValueDisplay from './components/ValueDisplay.vue'
import GroupList from './components/GroupList.vue'
import ConfigManager from './components/ConfigManager.vue'
import ProjectNavigator from './components/ProjectNavigator.vue'
import Notification from './components/Notification.vue'

const version = __APP_VERSION__
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
    <!-- 全局提示 -->
    <Notification />

    <header class="max-w-[1600px] mx-auto mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Chip Register Calculator
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1 font-bold">芯片寄存器位计算工具 {{ version }}</p>
      </div>
    </header>

    <main class="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">
      <aside class="lg:w-72 flex-shrink-0">
        <ProjectNavigator />
      </aside>

      <div class="flex-1 space-y-8 min-w-0">
        <BitGrid />
        <ValueDisplay />
        <ConfigManager />
      </div>
      
      <aside class="lg:w-80 flex-shrink-0">
        <GroupList />
      </aside>
    </main>

    <footer class="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-400 text-sm">
      Built with Vue 3 + Tailwind CSS
    </footer>
  </div>
</template>

<style>
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: color 0.2s, background-color 0.2s;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-thumb {
    background: #374151;
  }
}
</style>

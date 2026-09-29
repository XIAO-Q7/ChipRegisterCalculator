<script setup lang="ts">
import BitGrid from './components/BitGrid.vue'
import ValueDisplay from './components/ValueDisplay.vue'
import GroupList from './components/GroupList.vue'
import ConfigManager from './components/ConfigManager.vue'
import ProjectNavigator from './components/ProjectNavigator.vue'
import Notification from './components/Notification.vue'
import { useI18n, type Locale } from './i18n'

const version = import.meta.env.VITE_APP_VERSION
const { t, locale, setLocale, LOCALES } = useI18n()
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
        <p class="text-gray-500 dark:text-gray-400 mt-1 font-bold">{{ t('app.subtitle') }} {{ version }}</p>
      </div>
      <div
        class="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-0.5 shadow-sm"
        role="group"
        :aria-label="t('app.language')"
      >
        <button
          v-for="l in LOCALES"
          :key="l.value"
          @click="setLocale(l.value as Locale)"
          class="px-3 py-1 text-xs font-bold rounded-md transition-all"
          :class="locale === l.value
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-500 hover:text-blue-500'"
          :aria-pressed="locale === l.value"
          :lang="l.value === 'zh' ? 'zh-CN' : 'en'"
        >
          {{ l.label }}
        </button>
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
      {{ t('app.footer') }}
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

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'

function getGitVersion(): string {
  try {
    return execSync('git describe --tags --always --dirty', { encoding: 'utf-8' }).trim()
  } catch {
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(getGitVersion()),
  },
  plugins: [
    vue(),
    tailwindcss(),
  ],
})

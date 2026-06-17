import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'

function getGitVersion(): string {
  try {
    const hash = execSync('git describe --always --dirty', { encoding: 'utf-8' }).trim()
    return `0.0.0-${hash}`
  } catch {
    return '0.0.0-unknown'
  }
}

process.env.VITE_APP_VERSION = getGitVersion()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})

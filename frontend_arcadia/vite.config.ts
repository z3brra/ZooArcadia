import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
// config optimisée / corrigée avec ChatGPT
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@models": fileURLToPath(new URL('./src/models', import.meta.url)),
      "@assets": fileURLToPath(new URL('./src/assets', import.meta.url)),
    }
  }
})

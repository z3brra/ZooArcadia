import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
// config optimisée avec ChatGPT
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@models": path.resolve(__dirname, 'src/models'),
      "@assets": path.resolve(__dirname, 'src/assets'),
    }
  }
})

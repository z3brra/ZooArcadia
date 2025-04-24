import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
// config optimisée avec ChatGPT
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@types": path.resolve(__dirname, 'src/types'),
      "@assets": path.resolve(__dirname, 'src/assets'),
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    },
    fs: {
      // Allow serving files from parent directory
      allow: ['..']
    }
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})

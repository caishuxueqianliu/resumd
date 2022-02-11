import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/resumd/',
  plugins: [react()],
  build: {
    outDir:'resumd'
  }
})

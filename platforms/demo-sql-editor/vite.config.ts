import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve('src') }],
  },
})

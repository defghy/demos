import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from "@originjs/vite-plugin-federation"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
        name: 'vue3App',
        filename: 'remoteEntry.js',
        // Modules to expose
        exposes: {
            './views': './src/remote',
        },
        shared: ['vue']
    }) 
  ],
  server: {
    host: true,
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve('src') },
    ]
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})

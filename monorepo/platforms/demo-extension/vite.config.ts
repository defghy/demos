import path from 'path';
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile';
import legacy from '@vitejs/plugin-legacy';

const isDev = process.env.BUILD_ENV === 'development';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  mode: isDev ? 'development' : 'production',
  build: {
    minify: isDev ? false : 'terser',
    // sourcemap: isDev,
    // assetsInlineLimit: 100000000,
    // chunkSizeWarningLimit: 100000000,
    // cssCodeSplit: false,
    outDir: path.resolve('./crx/web'),
    rollupOptions: {
      inlineDynamicImports: true,
      output: {
        assetFileNames: "[name].[ext]",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        // manualChunks: () => "everything.js",
      },
    },
  },
  plugins: [
    vue(),
    // viteSingleFile(),
    legacy({ targets: ['chrome >= 60'] }),
  ]
})

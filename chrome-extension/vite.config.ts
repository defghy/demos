import path from 'path';
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile';
import legacy from '@vitejs/plugin-legacy';
// vite暂不支持symlink
import { chromeExtension } from './packages/hy-vite-plugin-chrome-ext/src/index.ts';

const { resolve } = path;
const isDev = process.env.BUILD_ENV === 'development';

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  base: './',
  mode: isDev ? 'development' : 'production',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    minify: isDev ? false : 'terser',
    // sourcemap: isDev,
    // assetsInlineLimit: 100000000,
    // chunkSizeWarningLimit: 100000000,
    // cssCodeSplit: false,
    outDir: path.resolve('./crx'),
    assetsDir: './',
    rollupOptions: {
      inlineDynamicImports: true,
      input: {
        main: resolve(__dirname, 'src/popup.html'),
        content: resolve(__dirname, 'src/content/content.ts'),
        background: resolve(__dirname, 'src/background.js'),
        sdk: resolve(__dirname, 'src/utils/sdk/page-sdk.ts'),
      },
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
    // legacy({ targets: ['chrome >= 60'] }),
    chromeExtension({
      singleScripts: ['content', 'sdk'],
    }),
  ]
})

import { resolve } from 'path'

import { defineConfig, loadEnv, type UserConfig } from 'vite'
import pluginVue2 from '@vitejs/plugin-vue2'
import pluginVue2JSX from '@vitejs/plugin-vue2-jsx'
import pluginBasicSsl from '@vitejs/plugin-basic-ssl'

export default ({ mode }) => {
  const envs = loadEnv(mode, process.cwd(), '')
  const isProd = envs['NODE_ENV'] === 'production'
  const config = {
    publicDir: resolve('./public'), // 静态资源路径
    plugins: [
      pluginVue2(),
      pluginVue2JSX(),
      pluginBasicSsl(),
    ],
    define: {

    },
    server: {
      port: Number(5173),
      open: '/',
      cors: true,
      host: true,
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts', '.jsx', '.tsx'],
      alias: [
        { find: '@', replacement: resolve('src') },
        { find: '~@', replacement: resolve('src') },
        {
          find: 'vue$',
          replacement: resolve('./node_modules/vue/dist/vue.runtime.esm.js'),
        },
      ],
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [],
        loader: {
          '.js': 'jsx',
        },
      },
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      sourcemap: true,
    },
  } as UserConfig

  return defineConfig(config)
}

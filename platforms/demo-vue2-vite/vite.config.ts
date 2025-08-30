import { resolve } from 'path'
import { defineConfig, loadEnv, type UserConfig } from 'vite'
import pluginVue2 from '@vitejs/plugin-vue2'
import pluginVue2JSX from '@vitejs/plugin-vue2-jsx'
import pluginBasicSsl from '@vitejs/plugin-basic-ssl'
import unpluginComponents from 'unplugin-vue-components/vite'
import unpluginImport from 'unplugin-auto-import/vite'
import { ElementUiResolver } from 'unplugin-vue-components/resolvers'
import { TinyVueSingleResolver } from '@opentiny/unplugin-tiny-vue'

const envKeys = ['NODE_ENV', 'VUE_APP_API_BASE_URL', 'VUE_APP_ENV']

export default ({ mode }) => {
  const envs = loadEnv(mode, process.cwd(), '')
  const isProd = envs['NODE_ENV'] === 'production'
  const isText = process.env.VITEST === 'true'
  const config = {
    publicDir: resolve('./public'), // 静态资源路径
    plugins: [
      pluginVue2({
        exclude: /.react.tsx$/,
      }),
      pluginVue2JSX({
        exclude: /.react.tsx$/,
      }),
      unpluginImport({
        dts: 'src/tmp/import.d.ts',
        resolvers: [ElementUiResolver(), TinyVueSingleResolver],
      }),
      unpluginComponents({
        dts: 'src/tmp/components.d.ts',
        dirs: [],
        resolvers: [ElementUiResolver(), TinyVueSingleResolver],
      }),
      pluginBasicSsl(),
    ].filter(f => !!f),
    define: {
      'process.env': {
        ...envKeys.reduce((acc: any, key) => {
          acc[key] = envs[key]
          return acc
        }, {}),
        VITE_ENV: true,
        TINY_MODE: 'pc',
      },
    },
    server: {
      port: Number(8888),
      open: '/',
      cors: true,
      host: true,
      hmr: {
        overlay: false,
      },
      proxy: {
        '/api': {
          target: 'https://ate.kxxxl.com/server/',
          // target: 'http://10.130.136.66:8088/',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts', '.jsx', '.tsx'],
      alias: [
        { find: '@', replacement: resolve('src') },
        { find: '~@', replacement: resolve('src') },
        { find: /^vue$/, replacement: resolve('./node_modules/vue/dist/vue.runtime.esm.js') },
        { find: '~ant-design-vue', replacement: resolve('./node_modules/ant-design-vue') },
        { find: 'ant-design-vue', replacement: resolve('./node_modules/ant-design-vue') },
        { find: 'element-ui', replacement: resolve('./node_modules/element-ui') },
        { find: 'lodash-es', replacement: resolve('./node_modules/lodash-es') },
      ],
      mainFields: isText ? ['module', 'main'] : undefined,
    },
    css: {
      postcss: {
        plugins: [],
      },
      // css预处理器
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          //使用 border-color:@border-color-base
          modifyVars: {
            'border-color-base': '#ccc',
          },
          math: 'always',
        },
      },
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
    esbuild: {},
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      sourcemap: isProd ? false : true,
    },
  } as UserConfig

  return defineConfig(config)
}

import { resolve, join } from 'path'
import fs from 'fs'

import { defineConfig, loadEnv, type UserConfig, UserConfigFn, PluginOption } from 'vite'

export default (({ command, mode }) => {
  const config = {
    plugins: [],
    test: {
      include: ['**/tests/*.vite.test.?(c|m)[jt]s?(x)'],
      environment: 'happy-dom',
      testTimeout: 1000 * 60 * 3,
      maxConcurrency: 20,
    },
  } as UserConfig

  return defineConfig(config)
}) as UserConfigFn

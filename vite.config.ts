import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { codeInspectorPlugin } from 'code-inspector-plugin';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwind(),
        autoprefixer(),
      ],
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
      ],
      dts: './src/types/auto-imports.d.ts',
    }),
    codeInspectorPlugin({
      bundler: 'vite',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '#': path.resolve(__dirname, './src/types'),
    },
  },
})
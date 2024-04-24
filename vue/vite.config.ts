import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const env = loadEnv('development', process.cwd(), '')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  define: {
    'process.env': env
  },
  plugins: [vue()],
  resolve: {
    alias: {
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      '@': path.resolve(__dirname, './src'),
      '@@': path.resolve(__dirname, './'),
      'src/': path.resolve(__dirname, './src')
    }
  }
})

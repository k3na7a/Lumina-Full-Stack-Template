import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import * as fs from 'fs'

const env = loadEnv('development', process.cwd(), '')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./certs/localhost-key.pem'),
      cert: fs.readFileSync('./certs/localhost.pem')
    },
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
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
      '@src': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, '../library')
    }
  }
})

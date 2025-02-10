import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify()],
  base: '/teleprompter-notes/',
  build: {
    outDir: 'docs', // Change output folder to "docs"
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  },
})
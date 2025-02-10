import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/teleprompter-notes/',
  build: {
    outDir: 'dist', // Change output folder to "docs"
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  plugins: [
    vue(),
    vuetify(),
    VitePWA({
      registerType: 'autoUpdate',
      base: '/teleprompter-notes/',
      // outDir: '/docs',
      devOptions: {
        enabled: true
      },
      workbox: {
        // globDirectory: 'docs',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,eot,woff2,woff,json}']
      },
      manifest: {
        name: 'teleprompter-notes',
        short_name: 'teleprompter-notes',
        start_url: '/teleprompter-notes/', // 👈 Correct start URL
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#42b883',
        icons: [
          {
            src: '/teleprompter-notes/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/teleprompter-notes/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
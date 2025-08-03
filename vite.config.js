import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 12000000,
      },
      manifest: {
        name: 'Pixels',
        short_name: 'Pixels',
        description: 'Pixels application',
        theme_color: '#2A31C5',
        background_color: '#F5F5F5',
        icons: [
          {
            src: 'vite-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'vite-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
